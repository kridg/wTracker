from django.contrib import admin
from .models import WorkoutLog,SetEntry,ExerciseEntry

@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display=("user","date")
    list_filter=("date",)
    search_fields=("user__username",)

@admin.register(ExerciseEntry)
class ExerciseEnterAdmin(admin.ModelAdmin):
    list_display=("name","workout_log","order")
    ordering=("workout_log","order")

@admin.register(SetEntry)
class SetEntryAdmin(admin.ModelAdmin):
    list_display=("exercise","weight","reps","order")
    ordering=("exercise","order")
