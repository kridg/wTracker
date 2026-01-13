from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model=User

    list_display=("username","email","unit_preference","is_active","is_staff")

    #Custom Fields for edit page
    fieldsets=UserAdmin.fieldsets+(
        ("Fitness Info",{
            "fields":("unit_preference","height_cm","weight_kg"),
        }),
    )

    #Custom Fields for create user page
    add_fieldsets=UserAdmin.add_fieldsets+(
        ("Fitness Info",{
            "fields":("unit_preference","height_cm","weight_kg"),
        }),
    )


