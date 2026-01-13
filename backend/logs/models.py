from django.db import models
from django.conf import settings

class WorkoutLog(models.Model):
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workout_logs"
    )

    date=models.DateTimeField()

    notes=models.TextField(
        blank=True,
        help_text="Optional Session Notes"
    )

    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=["-date"]
        unique_together=("user","date")

    def __str__(self):
        return f"{self.user}-{self.date}"
    
class ExerciseEntry(models.Model):
    workout_log=models.ForeignKey(
        WorkoutLog,
        on_delete=models.CASCADE,
        related_name="exercises"
    )

    name=models.CharField(max_length=100)

    order=models.PositiveIntegerField(
        help_text="Order of exercise in workout"
    )

    def __str__(self):
        return f"{self.name}({self.workout_log.date})"

class SetEntry(models.Model):
    exercise=models.ForeignKey(
        ExerciseEntry,
        on_delete=models.CASCADE,
        related_name="sets"
    )

    weight=models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Stored in kg"
    )

    reps=models.PositiveIntegerField()

    order=models.PositiveIntegerField(
        help_text="Set Number"
    )

    def __str__(self):
        return f"{self.weight}kg {self.reps}"