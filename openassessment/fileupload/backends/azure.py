from .django_storage import Backend

class AzureBackend(Backend):
    """
    Custom backend class that inherits from the Django file upload backend and provides Azure storage functionality.
    """
    def _get_file_name(self, key):
        """
        Returns the name of the keyed file.

        Since the Azure backend storage may be folders or it may use pseudo-folders,
        make sure the filename doesn't include any path separators.
        """
        file_name = key.replace("..", "").strip("/ ")
        return file_name
