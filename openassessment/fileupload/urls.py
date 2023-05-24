""" Urls for fileupload app. """


from django.conf.urls import url

from openassessment.fileupload import views_django_storage, views_filesystem, views_azure_storage

urlpatterns = [
    url(r'^django/(?P<key>.+)/$', views_django_storage.django_storage, name='openassessment-django-storage'),
    url(r'^azure/(?P<key>.+)/$', views_azure_storage.azure_storage, name='openassessment-azure-storage'),
    url(r'^(?P<key>.+)/$', views_filesystem.filesystem_storage, name='openassessment-filesystem-storage'),
]
