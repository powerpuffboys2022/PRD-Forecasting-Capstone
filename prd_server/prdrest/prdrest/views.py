from django.http import HttpResponse
from django.http import JsonResponse

def trainForecast(request):
    return JsonResponse({"message": "Ok trainForecast"})

def getForecast(request):
    return JsonResponse({"message": "Ok getforecast"})

def index(request):
    return HttpResponse("This is PRD rest server, no web view here.")