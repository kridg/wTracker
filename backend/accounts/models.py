from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class UnitChoices(models.TextChoices):
        METRIC = 'METRIC', 'Metric (kg, cm)'
        IMPERIAL = 'IMPERIAL', 'Imperial (lb, ft/in)'

    unit_preference=models.CharField(max_length=10,choices=UnitChoices.choices,default=UnitChoices.METRIC)

    height_cm=models.DecimalField(
        max_digits=5,
        decimal_places=2
        ,null=True,
        blank=True,
        help_text="Stored in Centimeters"
    )
    weight_kg=models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Stored in Kilograms"
    )

    def height_display(self):
        if not self.height_cm:
            return None
        if self.unit_preference==self.UnitChoices.IMPERIAL:
            total_inches=float(self.height_cm)/2.54
            feet=int(total_inches//12)
            inches=round(total_inches%12)
            return f"{feet}'{inches}\""
        return f"{self.height_cm} cm"
    
    def __str__(self):
        return f"{self.username}({self.unit_preference})"
        
    

