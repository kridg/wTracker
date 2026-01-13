from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    # object level permission
    def has_object_permission(self,request,view,obj):
        #Workout Log
        if hasattr(obj,"user"):
            return obj.user==request.user
        
        #Exercise Entry
        if hasattr(obj,"workout_log"):
            return obj.workout_log.user==request.user
        
        #Set Entry
        if hasattr(obj,"exercise"):
            return obj.exercise.workout_log.user==request.user
        
        return False