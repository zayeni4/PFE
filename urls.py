from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from survey.views import QuestionViewSet, ReponseViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'reponses', ReponseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
