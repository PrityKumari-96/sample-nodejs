# HeroCycle Pricing Engine

React frontend for the live Spring Boot Cycle Pricing Engine. The application does not mock data: inventory, price history, calculations, and saved configurations are requested from the backend.

## Run

Create `.env.local` when the backend is not at the default URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Then run:

```bash
npm install
npm run dev
```

The frontend is normally available at `http://localhost:5173`.

## Authentication contract

The frontend now requires salesperson authentication before opening the application. The current workspace contains no backend authentication implementation, so these live Spring Boot endpoints must be provided by the backend:

* `POST /api/auth/login` with `{ "email": "salesperson@example.com", "password": "..." }`, returning `{ "token": "...", "user": { "id": 1, "name": "...", "email": "..." } }`.
* `POST /api/auth/signup` with `{ "name": "...", "email": "...", "password": "..." }`, returning a success response or the same token response.

All protected frontend API requests send the returned token as `Authorization: Bearer <token>`. Until those backend routes are implemented, Login and Sign Up will display the backend error rather than accepting fake credentials.

## Connected endpoints

The UI calls these live backend routes:

* `GET /api/components?active=true` and component detail/history routes
* `POST` and `PUT /api/components/{id}/prices`
* `POST /api/pricing/calculate`
* `POST /api/configurations`
* `GET /api/configurations/{id}`
* `GET /api/salespersons/{id}/configurations`

Pricing and save requests send the detailed component snapshot fields (`componentId`, type, brand, name, size, specification, quantity), allowing the server to perform authoritative matching. Client validation requires an explicit salesperson, date, non-empty selection, positive quantities, and tyre quantities of 1 or 2. Prices are displayed with two decimals; backend totals are authoritative.

## Test and demo checklist

```bash
npm run build
npm run lint
```

1. Open Inventory and filter by component type; open a component to inspect history.
2. Add or upsert a price using an effective date and confirm the refreshed history.
3. Open Price a cycle, add explicit component lines, enter a salesperson ID, and Calculate.
4. Save the build, then open its saved detail to inspect the persisted snapshot.
5. Use Saved builds with a salesperson ID to list configurations.
