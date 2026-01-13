from django.shortcuts import render
from rest_framework import generics,permissions
from .models import WorkoutLog,ExerciseEntry,SetEntry
from .serializers import WorkoutLogSerializer,ExerciseEntrySerializer,SetEntrySerializer,WorkoutLogDetailSerializer
from rest_framework.permissions import IsAuthenticated  
from .permissions import IsOwner
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.db.models import Max,Count
from rest_framework.response import Response

###WORKOUT SESSION VIEWS
# sessions list+ create session 
class WorkoutLogListCreateView(generics.ListCreateAPIView):
    # serializer_class=WorkoutLogSerializer
    permission_classes=[IsAuthenticated]

# We use the List serializer for both GET (list) and POST (create)
    def get_serializer_class(self):
        return WorkoutLogSerializer

    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# retrive/update/delete a session
class WorkoutLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    # serializer_class=WorkoutLogSerializer
    permission_classes=[IsAuthenticated,IsOwner]

    def get_serializer_class(self):
        # Use the NESTED serializer only when fetching the details (GET)
        if self.request.method=="GET":
            return WorkoutLogDetailSerializer
        #if not get, then  default serializer
        return WorkoutLogSerializer
    
    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user)

###EXERCISE ENTRY VIEWS
#List + Create Exercise
class ExerciseEntryListCreateView(generics.ListCreateAPIView):
    serializer_class=ExerciseEntrySerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        log_id=self.kwargs["log_id"]
        return ExerciseEntry.objects.filter(
            workout_log__id=log_id,
            workout_log__user=self.request.user
        )
    
    def perform_create(self, serializer):
        log_id=self.kwargs["log_id"]
        log=get_object_or_404(
            WorkoutLog,
            id=log_id,
            user=self.request.user
        )
        serializer.save(workout_log=log)

#Retrieve/Update/Delete Exercise
class ExerciseEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=ExerciseEntrySerializer
    permission_classes=[IsOwner,IsAuthenticated]
    
    def get_queryset(self):
        return ExerciseEntry.objects.filter(
            workout_log__user=self.request.user
        )
    
###SET LOG VIEWS
#LIST + CREATE SETS
class SetEntryListCreateView(generics.ListCreateAPIView):
    serializer_class=SetEntrySerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        exercise_id=self.kwargs["exercise_id"]
        return SetEntry.objects.filter(
            exercise__id=exercise_id,
            exercise__workout_log__user=self.request.user
        )
    
    def perform_create(self, serializer):
        exercise_id=self.kwargs["exercise_id"]
        exercise=get_object_or_404(
            ExerciseEntry,
            id=exercise_id,
            workout_log__user=self.request.user
        )
        serializer.save(exercise=exercise)

class SetEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=SetEntrySerializer
    permission_classes=[IsOwner,IsAuthenticated]

    def get_queryset(self):
        return SetEntry.objects.filter(
            exercise__workout_log__user=self.request.user
        )

class WorkoutStatsView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user=request.user

        total_workouts=WorkoutLog.objects.filter(user=user).count()

        # We filter sets by checking if the related exercise belongs to a workout log owned by the user
        total_sets=SetEntry.objects.filter(exercise__workout_log__user=user).count()

        latest_data=WorkoutLog.objects.filter(user=user).aggregate(Max('date'))
        last_workout=latest_data['date__max']

        return Response({
            "total_workouts": total_workouts,
            "total_sets": total_sets,
            "last_workout": last_workout
        })