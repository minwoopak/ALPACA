from django.shortcuts import render
from django.views.generic import View

# Create your views here.
def index(request, *args, **kwargs):
    context = {
        'Title': "Main",
        'Home': "ALPACA (A Location-wise Proteome/transcriptome Abundance Comparative Analyzer)",
        'SubPage': "User Data Analysis",
        'About': "About"
    }
    return render(request, 'frontend/index.html', context)

    
def user_analysis(request):
    context = {
        'Title': "User Analysis",
        'Home': "ALPACA (A Location-wise Proteome/transcriptome Abundance Comparative Analyzer)",
        'SubPage': "User Data Analysis",
        'About': "About"
    }
    return render(request, 'frontend/user_analysis.html', context)


def about(request):
    context = {
        'Title': "About",
        'Home': "ALPACA (A Location-wise Proteome/transcriptome Abundance Comparative Analyzer)",
        'SubPage': "User Data Analysis",
        'About': "About"
    }
    return render(request, 'frontend/about.html', context)