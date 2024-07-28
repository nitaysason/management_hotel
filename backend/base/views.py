from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Client, Room, Reservation, Treatment, Order, Attraction, Ticket, ContactMessage
from .serializers import (UserSerializer, ClientSerializer, RoomSerializer, ReservationSerializer,
                          TreatmentSerializer, OrderSerializer, AttractionSerializer, TicketSerializer,
                          ContactMessageSerializer)
from django.core.exceptions import ObjectDoesNotExist

@api_view(['POST'])
def register(request):
    """Registers a new user with the given username, email, and password."""
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response("New user registered", status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    """Logs in a user and returns JWT tokens if the credentials are valid."""
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        # Check if the user is a client
        if Client.objects.filter(user=user).exists():
            client = Client.objects.get(user=user)
            response_data['client_id'] = client.id
        # Add staff information if the user is a staff member
        elif user.is_staff:
            response_data['staff_id'] = user.id  # or any other relevant staff information

        return Response(response_data, status=status.HTTP_200_OK)
    return Response("Invalid credentials", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logs out the current user."""
    logout(request)
    return Response("User logged out", status=status.HTTP_200_OK)

class RoomView(APIView):
    """Handles CRUD operations for Room objects."""
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id=None):
        """Retrieves a specific room by ID or all rooms if no ID is provided."""
        if room_id:
            try:
                room = Room.objects.get(id=room_id)
                serializer = RoomSerializer(room)
            except Room.DoesNotExist:
                return Response("Room not found", status=status.HTTP_404_NOT_FOUND)
        else:
            rooms = Room.objects.all()
            serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Creates a new room."""
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, room_id):
        """Updates an existing room by ID."""
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response("Room not found", status=status.HTTP_404_NOT_FOUND)
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, room_id):
        """Deletes a specific room by ID."""
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response("Room not found", status=status.HTTP_404_NOT_FOUND)
        room.delete()
        return Response("Room deleted", status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_reservation(request):
    """Creates a new reservation."""
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_reservations(request):
    """Retrieves reservations for the current user or all reservations if the user is a staff member."""
    if request.user.is_staff:
        # Staff members can view all reservations
        reservations = Reservation.objects.all()
    else:
        # Clients can only view their own reservations
        reservations = Reservation.objects.filter(client=request.user.client)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    """Cancels a reservation by ID."""
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        reservation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error canceling reservation: {e}")
        return Response({"error": "An error occurred while canceling the reservation"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_reservation(request, reservation_id):
    """Updates a reservation by ID."""
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        if not request.user.is_staff and reservation.client != request.user.client:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        serializer = ReservationSerializer(reservation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating reservation: {e}")
        return Response({"error": "An error occurred while updating the reservation"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_treatments(request):
    """Retrieves all treatments."""
    treatments = Treatment.objects.all()
    serializer = TreatmentSerializer(treatments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order_treatment(request):
    """Creates a new treatment order."""
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_orders(request):
    """Retrieves orders for the current user."""
    orders = Order.objects.filter(client=request.user.client)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request):
    """Creates a new ticket booking."""
    serializer = TicketSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_tickets(request):
    """Retrieves tickets for the current user."""
    tickets = Ticket.objects.filter(client=request.user.client)
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contact_messages(request):
    """Retrieves contact messages for the current user or all messages if the user is a staff member.""" 
    if request.user.is_staff:
        # Staff user - return all contact messages
        contact_messages = ContactMessage.objects.all()
    else:
        # Regular user - return only messages from this user
        contact_messages = ContactMessage.objects.filter(client=request.user.id)

    serializer = ContactMessageSerializer(contact_messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def contact_hotel(request):
    """Saves a new contact message from the current user."""
    contact_data = request.data
    contact_data['client'] = request.user.id  # Ensure the message is associated with the logged-in user
    serializer = ContactMessageSerializer(data=contact_data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def respond_contact_message(request, pk):
    """Responds to a contact message by ID."""
    try:
        contact_message = ContactMessage.objects.get(pk=pk)
    except ContactMessage.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.is_staff:
        contact_message.response = request.data.get('response', '')
        contact_message.save()
        return Response(ContactMessageSerializer(contact_message).data)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_contact_message(request, pk):
    """Deletes a contact message by ID."""
    try:
        contact_message = ContactMessage.objects.get(pk=pk)
    except ContactMessage.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.is_staff:
        contact_message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

# Staff-specific views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_clients(request):
     # Check if the user is a staff member
    if not request.user.is_staff:
        return Response("Unauthorized", status=status.HTTP_403_FORBIDDEN)
     # Retrieve all clients
    clients = Client.objects.all()
    # Serialize the client data
    serializer = ClientSerializer(clients, many=True)
    # Return the serialized data with a 200 OK status
    return Response(serializer.data, status=status.HTTP_200_OK)

# Manage orders (Create, Retrieve, Update, Delete)
@api_view(['POST', 'PUT', 'DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def manage_orders(request, order_id=None):
    # Check if the user is a staff member
    if not request.user.is_staff:
        return Response("Unauthorized", status=status.HTTP_403_FORBIDDEN)
    # Create a new order
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update an existing order
    elif request.method == 'PUT':
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response("Order not found", status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete an order
    elif request.method == 'DELETE':
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response("Order not found", status=status.HTTP_404_NOT_FOUND)
        order.delete()
        return Response("Order deleted", status=status.HTTP_204_NO_CONTENT)
    
    # Retrieve orders
    elif request.method == 'GET':
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response("Order not found", status=status.HTTP_404_NOT_FOUND)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            orders = Order.objects.all()
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        

# Manage tickets (Create, Retrieve, Update, Delete)
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_tickets(request, ticket_id=None):
     # Check if the user is a staff member
    if not request.user.is_staff:
        return Response("Unauthorized", status=status.HTTP_403_FORBIDDEN)
    
    # Retrieve tickets
    if request.method == 'GET':
        if ticket_id:
            try:
                ticket = Ticket.objects.get(id=ticket_id)
                serializer = TicketSerializer(ticket)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Ticket.DoesNotExist:
                return Response("Ticket not found", status=status.HTTP_404_NOT_FOUND)
        else:
            tickets = Ticket.objects.all()
            serializer = TicketSerializer(tickets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    # Create a new ticket
    elif request.method == 'POST':
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update an existing ticket
    elif request.method == 'PUT':
        try:
            ticket = Ticket.objects.get(id=ticket_id)
        except Ticket.DoesNotExist:
            return Response("Ticket not found", status=status.HTTP_404_NOT_FOUND)
        serializer = TicketSerializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a ticket
    elif request.method == 'DELETE':
        try:
            ticket = Ticket.objects.get(id=ticket_id)
        except Ticket.DoesNotExist:
            return Response("Ticket not found", status=status.HTTP_404_NOT_FOUND)
        ticket.delete()
        return Response("Ticket deleted", status=status.HTTP_204_NO_CONTENT)

# Manage treatments (Create, Retrieve, Update, Delete)
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_treatments(request, treatment_id=None):
    # Check if the user is a staff member
    if not request.user.is_staff:
        return Response("Unauthorized", status=status.HTTP_403_FORBIDDEN)

    # Retrieve treatments
    if request.method == 'GET':
        if treatment_id:
            try:
                treatment = Treatment.objects.get(id=treatment_id)
                serializer = TreatmentSerializer(treatment)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Treatment.DoesNotExist:
                return Response("Treatment not found", status=status.HTTP_404_NOT_FOUND)
        else:
            treatments = Treatment.objects.all()
            serializer = TreatmentSerializer(treatments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Create a new treatment
    elif request.method == 'POST':
        serializer = TreatmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing treatment
    elif request.method == 'PUT':
        try:
            treatment = Treatment.objects.get(id=treatment_id)
        except Treatment.DoesNotExist:
            return Response("Treatment not found", status=status.HTTP_404_NOT_FOUND)
        serializer = TreatmentSerializer(treatment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete a treatment
    elif request.method == 'DELETE':
        try:
            treatment = Treatment.objects.get(id=treatment_id)
        except Treatment.DoesNotExist:
            return Response("Treatment not found", status=status.HTTP_404_NOT_FOUND)
        treatment.delete()
        return Response("Treatment deleted", status=status.HTTP_204_NO_CONTENT)

# Manage attractions (Create, Retrieve, Update, Delete)    
class AttractionView(APIView):
    permission_classes = [IsAuthenticated]

     # Retrieve attractions
    def get(self, request, attraction_id=None):
        if attraction_id:
            try:
                attraction = Attraction.objects.get(id=attraction_id)
                serializer = AttractionSerializer(attraction)
            except Attraction.DoesNotExist:
                return Response("Attraction not found", status=status.HTTP_404_NOT_FOUND)
        else:
            attractions = Attraction.objects.all()
            serializer = AttractionSerializer(attractions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create a new attraction
    def post(self, request):
        serializer = AttractionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing attraction
    def put(self, request, attraction_id):
        try:
            attraction = Attraction.objects.get(id=attraction_id)
        except Attraction.DoesNotExist:
            return Response("Attraction not found", status=status.HTTP_404_NOT_FOUND)
        serializer = AttractionSerializer(attraction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete an attraction
    def delete(self, request, attraction_id):
        try:
            attraction = Attraction.objects.get(id=attraction_id)
        except Attraction.DoesNotExist:
            return Response("Attraction not found", status=status.HTTP_404_NOT_FOUND)
        attraction.delete()
        return Response("Attraction deleted", status=status.HTTP_204_NO_CONTENT)
