import os
from django.http import HttpResponse
import requests

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class AuthProxy(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    """
        PROBLEM: Gateway proxy was only handling JSON responses, but Django admin returns HTML content.

        WHAT WAS HAPPENING:
        1. When accessing /admin/, Django redirects (302) to /admin/login/?next=/admin/
        2. The login page returns HTML content (not JSON)
        3. Our old proxy code tried to parse everything as JSON with response.json()
        4. This caused the "Expecting value: line 1 column 1 (char 0)" error because HTML can't be parsed as JSON

        WHY IT FAILED:
        - Old code: return Response(response.json(), status=response.status_code)
        This assumes every response is JSON, which breaks for HTML pages like Django admin

        SOLUTION:
        - Detect content type of the incoming request
        - For JSON requests (API calls): Keep the old behavior - parse as JSON and return JSON
        - For form/HTML requests (admin pages): 
        * Forward the raw content without parsing
        * Forward cookies (needed for Django sessions/authentication)
        * Forward Set-Cookie and Location headers (needed for login and redirects)
        * Use HttpResponse instead of DRF Response to properly handle HTML

        KEY CHANGES:
        1. Check request.content_type to determine if it's JSON or form data
        2. For HTML/forms: Use response.content (raw bytes) instead of response.json()
        3. Forward cookies between browser <-> gateway <-> auth service (critical for admin login)
        4. Forward Set-Cookie header so auth service can set session cookies in browser
        5. Forward Location header so redirects work properly (like redirect to admin after login)
        6. Set allow_redirects=False to handle redirects manually and pass them to browser

        This maintains backward compatibility - all existing JSON API endpoints work exactly as before.
    """
    
    def post(self, request, path):
        base_url = os.environ.get("AUTH_APP_URL")
        url = f"{base_url}/{path}/"
        
        try:
            headers = {
                key: value for key, value in request.headers.items()
                if key.lower() not in ['host', 'connection']
            }
            cookies = request.COOKIES
            
            # Check if this is a JSON API request or HTML form request
            content_type = request.content_type
            
            if 'application/json' in content_type:
                # Handle JSON API requests (your existing logic)
                response = requests.post(
                    url=url,
                    json=request.data,
                    headers=headers,
                    cookies=cookies,
                    timeout=5
                )
                return Response(response.json(), status=response.status_code)
            else:
                # Handle HTML form requests (for admin and other forms)
                response = requests.post(
                    url=url,
                    headers=headers,
                    cookies=cookies,
                    data=request.POST,
                    files=request.FILES,
                    allow_redirects=False,
                    timeout=5
                )
                
                django_response = HttpResponse(
                    response.content,
                    status=response.status_code,
                    content_type=response.headers.get('Content-Type', 'text/html')
                )
                
                for header in ['Content-Type', 'Set-Cookie', 'Location']:
                    if header in response.headers:
                        django_response[header] = response.headers[header]
                
                return django_response
                
        except Exception as E:
            print(E)
            return Response({"error": str(E)}, status=500)
        
    def get(self, request, path):
        base_url = os.environ.get("AUTH_APP_URL")
        url = f"{base_url}/{path}/"
        
        try:
            # Forward headers from the original request (important for cookies, sessions)
            headers = {
                key: value for key, value in request.headers.items()
                if key.lower() not in ['host', 'connection']
            }
            
            # Forward cookies
            cookies = request.COOKIES
            
            response = requests.get(
                url=url,
                headers=headers,
                cookies=cookies,
                allow_redirects=False,  # Handle redirects manually
                timeout=5
            )
            
            # Create Django response with the same status code
            django_response = HttpResponse(
                response.content,
                status=response.status_code,
                content_type=response.headers.get('Content-Type', 'text/html')
            )
            
            # Forward important headers
            for header in ['Content-Type', 'Set-Cookie', 'Location']:
                if header in response.headers:
                    django_response[header] = response.headers[header]
            
            return django_response
            
        except Exception as E:
            print(E)
            return Response({"error": str(E)}, status=500)

class WorkerProxy(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def validate_user(self, request):
        """
        Returns user_id (str) if valid, None if invalid/anonymous.
        """
        auth_header = request.headers.get('Authorization')
        
        if auth_header is None:
            return None
        
        auth_service_url = os.getenv('AUTH_APP_URL')

        try:    
            response = requests.get(
            url=f"{auth_service_url}/validate/",
            headers={'Authorization': auth_header}, 
            timeout=3)
            if response.status_code == 200:
                return response.json().get('user_id')
        except:
            pass
        return None

    def post(self, request, path):
        # 1-> User authentication
        user_id = self.validate_user(request)
        if not user_id:
            return Response({"error":"Authentication credentials required"}, status=status.HTTP_400_BAD_REQUEST)
        
        worker_service_url = os.getenv('WORKER_SERVICE_URL')
        clean_path = path.strip('/')

        url = f"{worker_service_url}/{clean_path}/"

        try:
            # 2-> File and prompt parsing
            prompt_text = request.data.get('text') 

            # 'getlist' to receive multiple files. 
            # 'attachments' matches with formData.append('attachments', file) (frontend)
            uploaded_files = request.FILES.getlist('attachments') 

            if not uploaded_files and not prompt_text:
                return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)


            # 3-> Direct the file and text to the worker app
            # Prepare files. Format: ('key_name', (filename, file_content, content_type))
            files_payload = []
            for f in uploaded_files:
                files_payload.append(('files', (f.name, f, f.content_type)))
            data_payload = {'prompt': prompt_text, 'user_id': user_id}
            
            response = requests.post(url=url, data=data_payload, files=files_payload)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=503)
        
    def get(self, request, path):
        pass