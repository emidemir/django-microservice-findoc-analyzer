import os
import requests

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

class AuthProxy(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request, path):
        # Cubernetes pods can reach to configmap variables as .env variables
        # https://stackoverflow.com/a/71445468/17799171
        base_url = os.environ.get("AUTH_APP_URL")
        url = f"{base_url}/{path}/"
        
        try:
            response = requests.post(url=url, json=requests.data, timeout=5)
            return Response(response.json(), status=response.status_code)
        except Exception as E:
            return Response({"error":str(E)}, status=500)

    

class WorkerProxy(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request, path):
        pass

    def get(self, request, path):
        pass
    pass