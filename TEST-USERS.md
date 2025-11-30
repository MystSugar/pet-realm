# Pet Realm - Test User Cheatsheet

## Development Login Credentials

**Most users use password:** `password123` **(except Admin - see note below)**

### Test Users

| Role           | Email                    | Phone     | Password      | Name            | Description             |
| -------------- | ------------------------ | --------- | ------------- | --------------- | ----------------------- |
| **Admin**      | `admin@petrealm.com`     | `7000000` | `Admin123!`   | Pet Realm Admin | Platform administrator  |
| **Customer**   | `customer@petrealm.com`  | `7001234` | `password123` | Ahmed Hassan    | Customer-only account   |
| **Shop Owner** | `shopowner@petrealm.com` | `7002345` | `password123` | Fatima Ibrahim  | Shop owner-only account |

### Sample Shop

- **Shop Name:** Pet Paradise Malé
- **Owner:** Fatima Ibrahim (shopowner@petrealm.com)
- **Location:** Malé, Kaafu Atoll
- **Description:** Your one-stop shop for all pet needs in Malé

### Quick Login

1. Go to `/auth/signin`
2. Select **Password** login method
3. Use any email from the table above
4. Password: Use the password shown in the table (Admin uses `Admin123!`, others use `password123`)

### Notes

- All users are fully verified (email, phone, ID)
- Users have complete profile information
- The "Both Roles" user can switch between customer and shop owner views
- Shop owner has a sample shop already created
- All phone numbers use Maldivian format (+960 prefix implied)

### Reset Database (if needed)

```bash
pnpm prisma migrate reset --force
pnpm db:seed
```
