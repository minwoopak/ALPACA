from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def api_home(request):
    return HttpResponse("hi")