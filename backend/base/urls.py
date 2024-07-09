from django.urls import path
from .views import get_contact_messages, get_treatments, register, login_view, logout_view, RoomView, make_reservation, view_reservations, cancel_reservation, order_treatment, view_orders, book_ticket, view_tickets, contact_hotel

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('rooms/', RoomView.as_view(), name='rooms'),
    path('rooms/<int:room_id>/', RoomView.as_view(), name='room_detail'),
    path('reservations/make/', make_reservation, name='make_reservation'),
    path('reservations/view/', view_reservations, name='view_reservations'),
    path('reservations/cancel/<int:reservation_id>/', cancel_reservation, name='cancel_reservation'),
    path('orders/treatment/', order_treatment, name='order_treatment'),
    path('orders/view/', view_orders, name='view_orders'),
    path('tickets/book/', book_ticket, name='book_ticket'),
    path('tickets/view/', view_tickets, name='view_tickets'),
    path('contact/', contact_hotel, name='contact_hotel'),
    path('contact/messages/', get_contact_messages, name='get_contact_messages'),
    path('treatments/', get_treatments, name='get_treatments'),
    
]
