import requests

class SpokenDataAPI:
    def __init__(self, api_key: str, server_url: str = 'https://api.spokendata.com/v2'):
        self.api_key: str = api_key
        self.server_url: str = server_url
        
    def _check_response(self, response):
        if response.status_code != 200:
            raise SpokenDataException(response.status_code)
      
    @property  
    def _default_headers(self) -> str:
        return {
            'X-API-KEY': self.api_key
        }
        
    def _url(self, path: str = ""):
        return f'{self.server_url}/{path}'
        
    def get_job(self, job_id):
        response = requests.get(self._url(f'jobs/{job_id}'), headers=self._default_headers)
        self._check_response(response)
        return response.json()
    
    def get_transcript(self, job_id):
        print("Validating headers " +str(self._default_headers))
        response = requests.get(self._url(f'jobs/{job_id}/transcript'), headers=self._default_headers)
        self._check_response(response)
        return response.json()
    
    def get_groups(self, job_id):
        response = requests.get(self._url(f'jobs/{job_id}/transcript'), headers=self._default_headers)
        self._check_response(response)
        print("312 " + str(response.json()["groups"]))
        return response.json()["groups"]
    
    def put_transcript(self, job_id: str, transcript_data: dict):
        """Update transcript data for a job"""
        url = self._url(f'jobs/{job_id}/transcript')
        
        print("311 " + str(transcript_data) + " " + str(url))
        
        response = requests.put(
            url,
            headers={
                **self._default_headers,
                'Content-Type': 'application/json'
            },
            json=transcript_data
        )
        
        print("313 " + str(response) + str(self._check_response(response)))
        
        
        self._check_response(response)
        return response.json()
    
class SpokenDataException(Exception):
    """SpokenData API """

    def __init__(self, error_code, message = None):
        if message == None:
            if error_code == 400:
                message = "Invalid request (bad parameters)"
            if error_code == 401:
                message = "Unauthorized (bad API key)"
            if error_code == 404:
                message = "Not found"
            else:
                message = "Unknown error"
        
        super().__init__(message)
        
        self.message = message
        self.error_code = error_code

    def __str__(self):
        return f"{self.message} (Error Code: {self.error_code})"
