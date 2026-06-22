/* ============================================================
   740EATZ — SITE JAVASCRIPT
   indexJS.js

   v1 scope:
   - Burger menu toggle
   - Header scroll state
   - Flavor chip selection (syncs to form)
   - Order inquiry form submission

   v2 hooks marked with: // [V2 PAYMENT HOOK]
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

/*
    Set this endpoint when your backend or automation
    integration is ready. The fetch() call below will POST
    the order payload to this URL.
*/

const INQUIRY_ENDPOINT = "https://YOUR_ENDPOINT_HERE/order-inquiry";

/*
    [V2 PAYMENT HOOK]
    When Stripe or another payment provider is integrated,
    set the publishable key and payment endpoint here.

    const STRIPE_PUBLIC_KEY  = "pk_live_...";
    const PAYMENT_ENDPOINT   = "https://YOUR_ENDPOINT_HERE/create-payment-intent";
*/


/* ============================================================
   DOM REFERENCES
============================================================ */

const siteHeader   = document.getElementById("siteHeader");

const burgerBtn    = document.getElementById("burgerBtn");

const siteNav      = document.getElementById("siteNav");

const orderForm    = document.getElementById("orderForm");

const formFeedback = document.getElementById("formFeedback");

const formSubmitBtn = document.getElementById("formSubmitBtn");

const flavorSelect = document.getElementById("flavorSelect");

const flavorChips  = document.querySelectorAll(".flavorChip");


/* ============================================================
   HEADER — SCROLL STATE
============================================================ */

function onScroll ()
{

    if ( window.scrollY > 20 )
    {

        siteHeader.classList.add("scrolled");

    }
    else
    {

        siteHeader.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", onScroll, { passive: true });

onScroll();


/* ============================================================
   BURGER MENU — TOGGLE
============================================================ */

function openNav ()
{

    siteHeader.classList.add("navOpen");

    burgerBtn.setAttribute("aria-expanded", "true");

    burgerBtn.setAttribute("aria-label", "Close navigation menu");

    document.body.style.overflow = "hidden";

}

function closeNav ()
{

    siteHeader.classList.remove("navOpen");

    burgerBtn.setAttribute("aria-expanded", "false");

    burgerBtn.setAttribute("aria-label", "Open navigation menu");

    document.body.style.overflow = "";

}

if ( burgerBtn )
{

    burgerBtn.addEventListener("click", function ()
    {

        const isOpen = siteHeader.classList.contains("navOpen");

        if ( isOpen )
        {
            closeNav();
        }
        else
        {
            openNav();
        }

    });

}

/*
    Close nav when a nav link is clicked (mobile UX).
*/

document.querySelectorAll(".navLink").forEach(function ( link )
{

    link.addEventListener("click", function ()
    {

        closeNav();

    });

});

/*
    Close nav on outside click (tap the overlay).
*/

if ( siteNav )
{

    siteNav.addEventListener("click", function ( event )
    {

        if ( event.target === siteNav )
        {

            closeNav();

        }

    });

}

/*
    Close nav on Escape key.
*/

document.addEventListener("keydown", function ( event )
{

    if ( event.key === "Escape" && siteHeader.classList.contains("navOpen") )
    {

        closeNav();

    }

});


/* ============================================================
   FLAVOR CHIPS — SELECTION & FORM SYNC
============================================================ */

flavorChips.forEach(function ( chip )
{

    chip.addEventListener("click", function ()
    {

        /* Deselect all chips */

        flavorChips.forEach(function ( c ) { c.classList.remove("flavorActive"); });

        /* Activate clicked chip */

        chip.classList.add("flavorActive");

        /* Sync value to the order form flavor select */

        const flavorValue = chip.getAttribute("data-flavor");

        if ( flavorSelect )
        {

            flavorSelect.value = flavorValue;

        }

        /* Smooth scroll to order form */

        const orderSection = document.getElementById("order");

        if ( orderSection )
        {

            orderSection.scrollIntoView({ behavior: "smooth", block: "start" });

        }

    });

});


/* ============================================================
   FORM VALIDATION — HELPERS
============================================================ */

function getFieldValue ( id )
{

    const el = document.getElementById(id);

    return el ? el.value.trim() : "";

}

function validateForm ()
{

    const errors = [];

    if ( !getFieldValue("firstName") )
    {
        errors.push("First name is required.");
    }

    if ( !getFieldValue("lastName") )
    {
        errors.push("Last name is required.");
    }

    if ( !getFieldValue("phoneNumber") )
    {
        errors.push("Phone number is required.");
    }

    const emailVal = getFieldValue("email");

    if ( !emailVal || !emailVal.includes("@") )
    {
        errors.push("A valid email address is required.");
    }

    if ( !getFieldValue("productType") )
    {
        errors.push("Please select a product type.");
    }

    return errors;

}


/* ============================================================
   FORM — SHOW FEEDBACK
============================================================ */

function showFeedback ( type, message )
{

    if ( !formFeedback ) { return; }

    formFeedback.className = "formFeedback";

    formFeedback.classList.add( type === "success" ? "feedbackSuccess" : "feedbackError" );

    formFeedback.textContent = message;

    formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });

}

function clearFeedback ()
{

    if ( !formFeedback ) { return; }

    formFeedback.className = "formFeedback";

    formFeedback.textContent = "";

}


/* ============================================================
   FORM — BUILD PAYLOAD
============================================================ */

function buildPayload ()
{

    /*
        Payload is structured for email automation,
        dashboard intake, or webhook delivery.

        [V2 PAYMENT HOOK]
        When payment is added, include:
        - paymentStatus: "pending"
        - paymentIntentId: (from Stripe)
        - amountCents: (derived from productType)
        - pickupConfirmed: false
    */

    return {

        action:        "orderInquiry",

        source:        "740Eatz Website",

        firstName:     getFieldValue("firstName"),

        lastName:      getFieldValue("lastName"),

        phoneNumber:   getFieldValue("phoneNumber"),

        email:         getFieldValue("email"),

        productType:   getFieldValue("productType"),

        sizeQuantity:  getFieldValue("sizeQuantity"),

        flavor:        getFieldValue("flavorSelect"),

        pickupDate:    getFieldValue("pickupDate"),

        notes:         getFieldValue("notes"),

        submittedAt:   new Date().toISOString()

    };

}


/* ============================================================
   FORM — SUBMISSION
============================================================ */

if ( orderForm )
{

    orderForm.addEventListener("submit", async function ( event )
    {

        event.preventDefault();

        clearFeedback();

        /* Client-side validation */

        const errors = validateForm();

        if ( errors.length > 0 )
        {

            showFeedback("error", errors[0]);

            return;

        }

        /* Disable submit while sending */

        if ( formSubmitBtn )
        {

            formSubmitBtn.disabled  = true;

            formSubmitBtn.textContent = "Sending…";

        }

        const payload = buildPayload();

        /*
            [V2 PAYMENT HOOK]
            Before submitting the inquiry, future v2 flow:
            1. Validate product selection
            2. Calculate order total
            3. Create Stripe PaymentIntent via PAYMENT_ENDPOINT
            4. Mount Stripe Elements for card capture
            5. Confirm payment
            6. Then submit inquiry with paymentIntentId attached

            Example:
            const totalCents = getPriceForProduct(payload.productType);
            const intentRes  = await fetch(PAYMENT_ENDPOINT, { ... });
            const { clientSecret } = await intentRes.json();
            const result = await stripe.confirmCardPayment(clientSecret, { ... });
        */

        try
        {

            const response = await fetch(INQUIRY_ENDPOINT, {

                method:  "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            if ( response.ok )
            {

                showFeedback(
                    "success",
                    "Thank you! Your order inquiry has been sent. 740Eatz will follow up to confirm availability, payment, and pickup details."
                );

                orderForm.reset();

                flavorChips.forEach(function ( c ) { c.classList.remove("flavorActive"); });

                /*
                    [V2 PAYMENT HOOK]
                    On success, future v2 may redirect to a
                    confirmation/payment page or show an order summary
                    with a confirmation number.
                */

            }
            else
            {

                showFeedback(
                    "error",
                    "Something went wrong. Please try again or contact 740Eatz directly."
                );

            }

        }
        catch ( err )
        {

            /*
                Network error or endpoint not yet configured.
                In development, this is expected until the
                INQUIRY_ENDPOINT is set to a real URL.
            */

            showFeedback(
                "error",
                "Something went wrong. Please try again or contact 740Eatz directly."
            );

        }
        finally
        {

            if ( formSubmitBtn )
            {

                formSubmitBtn.disabled    = false;

                formSubmitBtn.textContent = "Send My Inquiry";

            }

        }

    });

}


/* ============================================================
   [V2 PAYMENT HOOK] — PRICE LOOKUP TABLE
   Ready for when product prices drive payment flow.
============================================================ */

/*

const PRODUCT_PRICES =
{

    largeGrapesPineapples:  4000,  // $40.00 in cents
    smallGrapesPineapples:  2500,  // $25.00 in cents
    dozenStrawberries:      2500,  // $25.00 in cents
    seafoodBoil:            null,  // inquire — variable
    customTray:             null   // inquire — variable

};

function getPriceForProduct ( productTypeValue )
{

    return PRODUCT_PRICES[ productTypeValue ] || null;

}

*/
