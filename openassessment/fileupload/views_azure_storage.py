"""
Provides the upload endpoint for the azure storage backend.
"""


from django.contrib.auth.decorators import login_required
from django.shortcuts import HttpResponse
from django.views.decorators.http import require_http_methods

from .backends.azure import Backend


@login_required()
@require_http_methods(["PUT"])
def azure_storage(request, key):
    """
    Upload files using azure storage backend.
    """
    Backend().upload_file(key, request.body)
    return HttpResponse()
