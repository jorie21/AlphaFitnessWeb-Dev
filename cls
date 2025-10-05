[33mcommit e504238fe82d2410235f531de60dcdff680c3406[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sun Oct 5 17:33:28 2025 +0800

    feat: refactor keycard and Stripe integration; streamline API calls, enhance error handling, and improve QR code generation

[33mcommit e44f8eec605d9e99bb88ee7983be36e5eba10bdf[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Thu Oct 2 11:20:17 2025 +0800

    Refactor keycard and payment handling:
    - Removed unused keycard insertion and webhook routes.
    - Implemented Stripe checkout session creation and webhook handling for keycard purchases.
    - Updated ProfileHeader to manage digital keycards and integrated modal for displaying keycard details.
    - Enhanced services page for keycard purchases with improved error handling and loading states.
    - Created a new success page for payment confirmation with detailed instructions and keycard information.
    - Added DigitalKeycardModal component for displaying keycard details and QR codes.
    - Updated next.config.mjs to allow QR code image fetching from external API.
    - Updated package dependencies for Stripe integration.

[33mcommit 3856231a3b83a52dd9f6ab5031a6a1f383a54fc1[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Wed Oct 1 09:47:10 2025 +0800

    feat: refactor keycard checkout and management API; implement new checkout route, enhance keycard retrieval, and add keycard insertion logic

[33mcommit 0479441fffd0fa36c9b6efe943839ca136ba39bd[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Tue Sep 23 01:22:11 2025 +0800

    feat: integrate Stripe for keycard checkout and payment processing
    
    - Added checkout route for creating Stripe sessions and handling payments.
    - Implemented webhook to manage successful payment events and update keycard status in Supabase.
    - Created GET route to retrieve keycard details using unique ID.
    - Developed success page to display payment confirmation and keycard information.
    - Introduced NotFound component with animated UI for better user experience.
    - Updated package.json and package-lock.json to include Stripe dependency.
    - Removed deprecated code related to previous payment methods.

[33mcommit 27829f5c8947402754ae1b0cc367fdf783484f82[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Thu Sep 18 03:37:09 2025 +0800

    feat: add keycard payment API integration and QR code generation
    
    - Implemented POST endpoint for creating keycards with Xendit payment processing.
    - Added QR code generation for new keycards.
    - Updated package.json to include new dependencies: xendit-node and qrcode.
    - Created ProfileDropdown component using Radix UI dropdown menu for user profile actions.
    - Developed reusable dropdown menu components for better UI consistency.

[33mcommit 3419ed6954aa4ffc3d1087d99075241452f4d394[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Mon Sep 15 01:54:10 2025 +0800

    feat: implement password reset functionality and enhance authentication flow with new user sign-in options

[33mcommit 410d6e2d5612ddd7474eeca11074998398013752[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sat Sep 6 15:08:04 2025 +0800

    feat: update registration and login forms with validation and error handling
    
    - Refactored registration and login modals to use Zod for validation.
    - Changed field names in validation schema from CreatePassword and ConfirmPassword to password and confirmPassword.
    - Added error handling for form submissions in both modals.
    - Integrated Sonner for toast notifications on authentication actions.
    - Updated auth context to manage user session and loading states.
    - Implemented Google sign-in functionality in the auth context.
    - Improved UI components for better user experience and error display.

[33mcommit 9bf99c5311b64692599e4da7a6900a94cfc0c80d[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sat Sep 6 03:36:44 2025 +0800

    feat: enhance authentication flow with improved login validation, error handling, and session management; refactor LoginModal and auth context

[33mcommit addf69cfc9f25f376a4526d3b916758024babbaf[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Thu Sep 4 05:22:30 2025 +0800

    feat: implement authentication context and user login functionality; refactor registration and login components

[33mcommit b432a279c766bca7c7a93bd90999cfa61ae75839[m[33m ([m[1;31mproduction/main[m[33m)[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Wed Sep 3 01:06:41 2025 +0800

    Updated registration modal and fixed Supabase SSR setup

[33mcommit b67037ad190918550c32f286ea15479ca0e2fd63[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Fri Aug 29 07:06:10 2025 +0800

    feat: add user registration functionality with Supabase integration
    
    - Implemented user registration logic in `register.js` using Supabase for authentication.
    - Added validation schema for registration in `registerValidation.js` using Zod.
    - Created a Supabase client for server-side operations in `supabaseClient.js`.
    - Updated dependencies in `package.json` and `package-lock.json` to include necessary libraries for form handling and validation.
    - Added a new action for user login in `login.js`.

[33mcommit b8911df9d0ae74d802aa5457c504c49014afc4ba[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Tue Aug 19 02:58:00 2025 +0800

    Enhance UI and animations across profile and footer sections; improve responsiveness and accessibility in LoyaltyStatus, ProfileHeader, and AnnouncementSection components

[33mcommit ec1a30ec298a8664b36e27ce416e39c7fd29f7d1[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sun Aug 17 23:49:41 2025 +0800

    Refactor AboutSection and AnnouncementSection for improved animations and structure; update features to use component references

[33mcommit a84e8d0011fcbbf2c95eaec94cf178da459f9694[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sun Aug 17 23:01:31 2025 +0800

    Add Select and Textarea components with styling and functionality

[33mcommit cc5c20ec17d618183d79b4d5481a837329b44443[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Thu Aug 14 04:51:54 2025 +0800

    Add profile components and enhance UI with loyalty status and nutrition card

[33mcommit eebfa0bb14ced091e39dc2dcd91256066652b128[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Mon Aug 11 05:01:43 2025 +0800

    Refactor components and enhance UI for Alpha Fitness application
    
    - Changed header structure in AlphaFitness component from <h1> to <span> for better semantics.
    - Updated Topbar component to use fixed positioning and improved drawer functionality.
    - Integrated LoginModal and RegistrationModal components with updated button styles and functionality.
    - Enhanced LoginModal with responsive design and improved layout.
    - Refactored RegistrationModal for better user experience and added social login options.
    - Adjusted TestimonialSection styles and carousel settings for improved performance.
    - Added new button variant for secondary blue styling.
    - Created layout component for consistent application structure.
    - Implemented FitnessTrainingCoach, PackageDeals, and PerSessionRates components with Swiper for better user interaction.

[33mcommit 5514bd160daa6aad8fec16c573ae0e1770ada121[m
Author: jorie21 <visayajorie@gmail.com>
Date:   Sat Aug 9 03:35:37 2025 +0800

    Alpha fitness uploaded
