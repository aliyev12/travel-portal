1. Spin up a Next.js server
  a) Build front end with material ui

  b) Implement restrictions that users can only review a tour that they have actually booked.

  c) Implement nested booking routes: "/tours/:id/bookings"  and "users/:id/bookings"

  d) Improve tour dates: add participants and soldOut field to each date. A date then becomes line an instance of the tour. Then, when a user books, they need to select one of the dates. A new booking will increase the number of participants in the date, until it is booked out (participants > maxGroupSize). So, when a user wants to book, you need to check if tour on the selected date is still available.

  e) Implement advanced authentication features: confirm user email, keep users logged in with refresh tokens, two-factor authentication, etc.

  f) Implement sign up form; 

  g) On the tour details page, if a user  has taken a tour, allow them to add a review directly on the website. 

  h) Hide the entire booking section on the tour details page if current user has already booked the tour (also prevent duplicate bookings on the model)

  i) Implement "like tour" with favorites tour page.

  j) On the user account page, implement the "My Reviews" page, where all reviews are displayed, and a user can edit them. 

  k) For administrators, implement all the "Manage" pages, where they can CRUD tours, users, reviews, and bookings.

  l)

  m)

  n)

2. Do templates with Next and react
3. Add graphql wrappers with Apollo Server for data routes
4. Add Apollo Client for Next.js
5. Replace pug email templates with something nicer