from rest_framework import serializers
from .models import WorkoutLog,ExerciseEntry,SetEntry
from datetime import date
from django.utils import timezone

class SetEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model=SetEntry
        fields=[
            "id",
            "weight",
            "reps",
            "order",
            ]
        read_only_fields=["id"]

    def validate_reps(self,value):
        if value<=0:
            raise serializers.ValidationError("Reps must be greater than 0")
        return value
    
    def validate_weight(self,value):
        if value<0:
            raise serializers.ValidationError("Weight cannot be less than 0")
        return value
    
    def validate_order(self,value):
        if value<1:
            raise serializers.ValidationError("Set order cannot be less than 0")
        return value
    def validate(self, attrs):
        #prevent duplicate order number
        # exercise=self.context.get("exercise")    *This could be used if we manually created a serializer

        exercise=self.instance.exercise if self.instance else None
        order=attrs.get("order")

        if exercise and order:
            qs=SetEntry.objects.filter(exercise=exercise,order=order,)

            if self.instance:
                qs=qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError(
                    "A set with the same order already exists"
                )
        return attrs
    
class ExerciseEntrySerializer(serializers.ModelSerializer):
    # this is to get the whole exercise data together when fetching individual log
    sets=SetEntrySerializer(many=True,read_only=True)
    class Meta:
        model=ExerciseEntry
        fields=[
            "id",
            "name",
            "order",
            "sets",]
        read_only_fields=["id"]

    def validate_order(self,value):
        if value<1:
            raise serializers.ValidationError("Exercise order must be greater than 0")
        return value
        
    def validate(self,attrs):
        workout_log=self.instance.workout_log if self.instance else None
        order=attrs.get("order")

        if workout_log and order:
            qs=ExerciseEntry.objects.filter(
                workout_log=workout_log,
                order=order,)

            if self.instance:
                qs=qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError(
                    "An exercise with the same order already exists"
                )
        return attrs
            
class WorkoutLogSerializer(serializers.ModelSerializer):
    class Meta:
        model=WorkoutLog
        fields=["id","date","notes","created_at",]
        read_only_fields=["id","created_at"]
    
    def validate_date(self,value):
        if value.date()>timezone.now().date():
            raise serializers.ValidationError("Workout date cannot be set in the future")
        return value
    
class WorkoutLogDetailSerializer(serializers.ModelSerializer):
    exercises=ExerciseEntrySerializer(many=True,read_only=True)
    class Meta:
        model = WorkoutLog
        fields = ["id", "date", "notes", "created_at", "exercises"]
        read_only_fields = ["id", "created_at"]





