from django.urls import path
from .views import(
    WorkoutLogDetailView,
    WorkoutLogListCreateView,
    ExerciseEntryDetailView,
    ExerciseEntryListCreateView,
    SetEntryDetailView,
    SetEntryListCreateView,
    WorkoutStatsView
)

urlpatterns=[
    path("logs/",WorkoutLogListCreateView.as_view(),name="log-list-create"),
    path("logs/<int:pk>/",WorkoutLogDetailView.as_view(),name="log-detail"),

    path("logs/<int:log_id>/exercises/",ExerciseEntryListCreateView.as_view(),name="exercise-list-create"),
    path("exercises/<int:pk>",ExerciseEntryDetailView.as_view(),name="exercise-detail"),

    path("exercises/<int:exercise_id>/sets/",SetEntryListCreateView.as_view(),name="set-list-create"),
    path("sets/<int:pk>",SetEntryDetailView.as_view(),name="set-detail"),
    path('stats/', WorkoutStatsView.as_view(), name='workout-stats'),
]