from rest_framework.views import APIView
from rest_framework.response import Response

class UploadView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt')
        files = request.FILES.getlist('files') 
        user_id = request.data.get('user_id')

        print(f"Service B received: {len(files)} files and prompt: {prompt}")

        return Response({'result': 'Analysis complete'}, status=200)


class DownloadView(APIView):
    pass