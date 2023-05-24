import os

from .django_storage import Backend
from django.urls import reverse


class AzureBackend(Backend):
    """
    Custom backend class that inherits from the Django file upload backend and provides Azure storage functionality.
    """

    def get_upload_url(self, key, content_type):
        """
        Return the URL pointing to the ORA2 azure storage upload endpoint.
        """
        return reverse("openassessment-azure-storage", kwargs={'key': key})

    def get_download_url(self, key):
        """
        Return the download URL for the given key.
        If not found in first row; try with different format key
        Returns None if no file exists at that location.
        """
        url = super().get_download_url(key)
        if url is None:
            return super().get_download_url(self._get_file_name_fs(key))
        return url

    def upload_file(self, key, content):
        """
        Upload the given file content to the cloud.
        Return public direct url to file
        """
        super().upload_file(key, content)
        return self.get_download_url(key)

    def _get_file_name_fs(self, key):
        """
        Returns the name of the file with the fs key that does not contain /
        """
        file_name = key.replace("..", "").strip("/ ")
        file_name = file_name.replace(os.sep, "_")
        return file_name

    def _get_file_name(self, key):
        """
        Returns the name of the proper s3-like keyed file.
        """
        file_name = key.replace("..", "").strip("/ ")
        return file_name
