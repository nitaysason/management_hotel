from django.contrib import admin
from .models import Client, Room, Reservation, Treatment, Order, Attraction, Ticket, ContactMessage

admin.site.register(Client)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(Treatment)
admin.site.register(Order)
admin.site.register(Attraction)
admin.site.register(Ticket)
admin.site.register(ContactMessage)
