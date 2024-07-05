from django.contrib import admin
from .models import CarMake, CarModel


@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('type', 'car_make', 'year')
    search_fields = ('name', 'car_make__name')
