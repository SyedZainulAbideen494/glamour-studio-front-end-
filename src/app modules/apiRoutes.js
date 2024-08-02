const API_URL = 'https://4f40bc69c3707e6f9eaa771fc195bae8.serveo.net/glast';

export const API_ROUTES = {
  login: `${API_URL}/login`,
  signup: `${API_URL}/signup`,
  fetchEvents: `${API_URL}/api/events`,
  profilePic: `${API_URL}/profilePic`,
  deactivateEvent: `${API_URL}/api/events/deactivate`,
  bannersDisplay: `${API_URL}`,
  getUserEventCount: `${API_URL}/countPhoneNumbers`,
  getJoinedEventsCount: `${API_URL}/getCalendarEventsCount`,
  getRegistrationAllEventCount: `${API_URL}/getRegistrationsCount`,
  getAllEventAllAttendeeData: `${API_URL}/getEventAttendees/data`,
  getAllRegCountGraph: `${API_URL}/api/calendarCounts`,
  getAppontments: `${API_URL}/getAppointments`,
  createEvent: `${API_URL}/api/create_event`,
  getAdvanceTickets: `${API_URL}/api/advance_tickets`,
  getQuarry: `${API_URL}/getquarry`,
  getCustomEvents: `${API_URL}/api/custom/events`,
  getEventDetails: `${API_URL}/api/events`
};
