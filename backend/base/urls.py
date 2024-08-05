from django.urls import path
from .views import (AttractionView, delete_contact_message, get_contact_messages, get_treatments, manage_rooms, register, login_view, logout_view,  
                    make_reservation, respond_contact_message, view_reservations, cancel_reservation,update_reservation, order_treatment, view_orders, 
                    book_ticket, view_tickets, contact_hotel, view_clients, manage_orders, manage_tickets, manage_treatments)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('rooms/', manage_rooms, name='manage_rooms'),
    path('rooms/<int:room_id>/', manage_rooms, name='manage_room'),
    path('reservations/make/', make_reservation, name='make_reservation'),
    path('reservations/view/', view_reservations, name='view_reservations'),
    path('reservations/cancel/<int:reservation_id>/', cancel_reservation, name='cancel_reservation'),
    path('reservations/update/<int:reservation_id>/', update_reservation, name='update_reservation'),
    path('orders/treatment/', order_treatment, name='order_treatment'),
    path('orders/view/', view_orders, name='view_orders'),
    path('tickets/book/', book_ticket, name='book_ticket'),
    path('tickets/view/', view_tickets, name='view_tickets'),
    path('contact/', contact_hotel, name='contact_hotel'),
    path('contact/messages/', get_contact_messages, name='get_contact_messages'),
    path('contact/messages/respond/<int:pk>/', respond_contact_message, name='respond_contact_message'),
    path('contact/messages/delete/<int:pk>/', delete_contact_message, name='delete_contact_message'),
    path('treatments/', get_treatments, name='get_treatments'),
    path('clients/', view_clients, name='view_clients'),
    path('orders/manage/', manage_orders, name='manage_orders'),  # For POST
    path('orders/manage/<int:order_id>/', manage_orders, name='manage_order'),  # For PUT and DELETE
    path('tickets/manage/', manage_tickets, name='manage_tickets'),  # For POST
    path('tickets/manage/<int:ticket_id>/', manage_tickets, name='manage_ticket'),  # For PUT and DELETE
    path('attractions/manage/', AttractionView.as_view(), name='manage_attractions'),  # For POST and GET all
    path('attractions/manage/<int:attraction_id>/', AttractionView.as_view(), name='manage_attraction'),  # For GET, PUT, and DELETE
    path('treatments/manage/', manage_treatments, name='manage_treatments'),  # For POST
    path('treatments/manage/<int:treatment_id>/', manage_treatments, name='manage_treatment'),  # For PUT and DELETE
]
