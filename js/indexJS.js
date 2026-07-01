/* ============================================================
   740EATZ — INDEX PAGE JAVASCRIPT
   indexJS.js

   Scope:
   - Header scroll state
   - Burger menu toggle
   - Menu dropdown (desktop + mobile)
   - Order builder (orderPage.html)
   - Copyright year (dynamic)

   V2 Architecture Hooks:
   [V2 PAYMENT HOOK]   — Stripe payment integration point
   [V2 DASHBOARD HOOK] — Order management system POST point
   [V2 EMAIL HOOK]     — Confirmation email trigger point
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

const ORDER_ENDPOINT = "https://YOUR_ENDPOINT_HERE/order-request";

/*
    [V2 PAYMENT HOOK]
    When payment is integrated:
    const STRIPE_PUBLIC_KEY = "pk_live_...";
    const PAYMENT_ENDPOINT  = "https://YOUR_ENDPOINT_HERE/create-payment-intent";
*/


/* ============================================================
   COPYRIGHT YEAR — DYNAMIC
============================================================ */

const copyrightYearEl = document.getElementById("copyrightYear");

if ( copyrightYearEl )
{

    copyrightYearEl.textContent = new Date().getFullYear();

}


/* ============================================================
   DOM REFERENCES
============================================================ */

const siteHeader      = document.getElementById("siteHeader");

const burgerBtn       = document.getElementById("burgerBtn");

const siteNav         = document.getElementById("siteNav");

const menuDropdownBtn  = document.getElementById("menuDropdownBtn");

const menuDropdownItem = document.getElementById("menuDropdownItem");


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

/* Close nav when clicking a non-dropdown navLink */

document.querySelectorAll(".navLink:not(.navLinkHasDropdown)").forEach(function ( link )
{

    link.addEventListener("click", function ()
    {

        closeNav();

    });

});

/* Close nav when clicking the backdrop */

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

/* Close nav on Escape */

document.addEventListener("keydown", function ( event )
{

    if ( event.key === "Escape" )
    {

        if ( siteHeader.classList.contains("navOpen") )
        {
            closeNav();
        }

        closeMenuDropdown();

    }

});


/* ============================================================
   MENU DROPDOWN
============================================================ */

function openMenuDropdown ()
{

    if ( !menuDropdownItem || !menuDropdownBtn ) { return; }

    menuDropdownItem.classList.add("dropdownOpen");

    menuDropdownBtn.setAttribute("aria-expanded", "true");

}

function closeMenuDropdown ()
{

    if ( !menuDropdownItem || !menuDropdownBtn ) { return; }

    menuDropdownItem.classList.remove("dropdownOpen");

    menuDropdownBtn.setAttribute("aria-expanded", "false");

}

function toggleMenuDropdown ()
{

    if ( !menuDropdownItem ) { return; }

    const isOpen = menuDropdownItem.classList.contains("dropdownOpen");

    if ( isOpen )
    {
        closeMenuDropdown();
    }
    else
    {
        openMenuDropdown();
    }

}

if ( menuDropdownBtn )
{

    menuDropdownBtn.addEventListener("click", function ( event )
    {

        event.stopPropagation();

        toggleMenuDropdown();

    });

}

/* Close dropdown when clicking outside */

document.addEventListener("click", function ( event )
{

    if ( !menuDropdownItem ) { return; }

    if ( !menuDropdownItem.contains(event.target) )
    {

        closeMenuDropdown();

    }

});

/* Close dropdown sub-nav links on mobile */

document.querySelectorAll(".navSubLink").forEach(function ( link )
{

    link.addEventListener("click", function ()
    {

        closeMenuDropdown();

        closeNav();

    });

});


/* ============================================================
   HELPERS — FORM UTILITIES
============================================================ */

function getVal ( id )
{

    const el = document.getElementById(id);

    return el ? el.value.trim() : "";

}

function showFeedback ( el, type, message )
{

    if ( !el ) { return; }

    el.className = "formFeedback";

    el.classList.add( type === "success" ? "feedbackSuccess" : "feedbackError" );

    el.textContent = message;

    el.scrollIntoView({ behavior: "smooth", block: "nearest" });

}

function clearFeedback ( el )
{

    if ( !el ) { return; }

    el.className = "formFeedback";

    el.textContent = "";

}


/* ============================================================
   ORDER BUILDER — STATE
============================================================ */

const builderState = {

    step:    1,

    product: null,

    size:    null,

    flavor:  null,

    date:    null,

    firstName: "",

    lastName:  "",

    phone:     "",

    email:     "",

    notes:     ""

};

const TOTAL_STEPS = 6;


/* ============================================================
   ORDER BUILDER — PRICING
============================================================ */

const PRODUCT_PRICES =
{

    candyGrapes:
    {
        small:       25,
        large:       40,
        threeFlavor: 45
    },

    chocoStrawberries:
    {
        dozen: 25
    },

    customTray:
    {
        custom: null
    }

};

function getPriceDisplay ( product, size )
{

    if ( product === "candyGrapes" )
    {

        if ( size === "small" )       { return "$25"; }

        if ( size === "large" )       { return "$40"; }

        if ( size === "threeFlavor" ) { return "$45"; }

    }

    if ( product === "chocoStrawberries" ) { return "$25 (dozen)"; }

    if ( product === "customTray" ) { return "Custom Quote"; }

    return "TBD";

}


/* ============================================================
   ORDER BUILDER — INITIALIZATION
============================================================ */

const builderWrap      = document.getElementById("productBuilder");

const progressFill     = document.getElementById("builderProgressFill");

const stepLabel        = document.getElementById("builderStepLabel");

const backBtn          = document.getElementById("builderBackBtn");

const nextBtn          = document.getElementById("builderNextBtn");

const builderSubmitBtn = document.getElementById("builderSubmitBtn");

const builderFeedback  = document.getElementById("builderFeedback");

function updateProgress ()
{

    if ( !progressFill || !stepLabel ) { return; }

    const pct = ( ( builderState.step - 1 ) / ( TOTAL_STEPS - 1 ) ) * 100;

    progressFill.style.width = pct + "%";

    const stepNames = ["", "Choose Product", "Choose Size", "Choose Flavor", "Pick Pickup Date", "Your Info", "Review Order"];

    stepLabel.textContent = "Step " + builderState.step + " of " + TOTAL_STEPS + " — " + stepNames[ builderState.step ];

}

function showPanel ( step )
{

    for ( let i = 1; i <= TOTAL_STEPS; i++ )
    {

        const panel = document.getElementById("builderPanel" + i);

        if ( panel )
        {

            if ( i === step )
            {
                panel.classList.remove("builderPanelHidden");
            }
            else
            {
                panel.classList.add("builderPanelHidden");
            }

        }

    }

    /* Back button visibility */

    if ( backBtn )
    {

        backBtn.style.visibility = step === 1 ? "hidden" : "visible";

    }

    /* Show/hide nav row on summary step */

    const navRow = document.getElementById("builderNavRow");

    if ( navRow )
    {

        navRow.style.display = step === TOTAL_STEPS ? "none" : "flex";

    }

    updateProgress();

}

function validateStep ( step )
{

    if ( step === 1 ) { return builderState.product !== null; }

    if ( step === 2 ) { return builderState.size !== null; }

    if ( step === 3 )
    {

        if ( builderState.product === "chocoStrawberries" || builderState.product === "customTray" )
        {
            return true;
        }

        return builderState.flavor !== null;

    }

    if ( step === 4 )
    {

        const dateEl = document.getElementById("builderPickupDate");

        if ( !dateEl || !dateEl.value ) { return false; }

        const selected = new Date( dateEl.value + "T00:00:00" );

        const day = selected.getDay();

        return day === 1 || day === 2 || day === 5;

    }

    if ( step === 5 )
    {

        const firstName = getVal("bFirstName");

        const phone     = getVal("bPhone");

        const email     = getVal("bEmail");

        return firstName && phone && email && email.includes("@");

    }

    return true;

}

function updateNextBtn ()
{

    if ( !nextBtn ) { return; }

    nextBtn.disabled = !validateStep( builderState.step );

}

if ( builderWrap )
{

    /* ── Product Choices ── */

    document.querySelectorAll(".builderChoice").forEach(function ( btn )
    {

        btn.addEventListener("click", function ()
        {

            document.querySelectorAll(".builderChoice").forEach(function ( b ) { b.classList.remove("isSelected"); });

            btn.classList.add("isSelected");

            builderState.product = btn.getAttribute("data-product");

            builderState.size    = null;

            builderState.flavor  = null;

            populateSizeGrid();

            updateNextBtn();

        });

    });

    /* ── Size Options ── */

    function populateSizeGrid ()
    {

        const grid = document.getElementById("sizeChoices");

        if ( !grid ) { return; }

        grid.innerHTML = "";

        if ( builderState.product === "candyGrapes" )
        {

            const sizes =
            [
                { value: "small",       label: "Small",              price: "$25" },
                { value: "large",       label: "Large",              price: "$40" },
                { value: "threeFlavor", label: "Large — 3 Flavors",  price: "$45" }
            ];

            sizes.forEach(function ( s )
            {

                const opt = document.createElement("button");

                opt.type            = "button";

                opt.className       = "sizeOption";

                opt.dataset.size    = s.value;

                opt.innerHTML       = "<span class='sizeOptionName'>" + s.label + "</span><span class='sizeOptionPrice'>" + s.price + "</span>";

                opt.addEventListener("click", function ()
                {

                    grid.querySelectorAll(".sizeOption").forEach(function ( b ) { b.classList.remove("isSelected"); });

                    opt.classList.add("isSelected");

                    builderState.size = s.value;

                    updateNextBtn();

                });

                grid.appendChild(opt);

            });

        }
        else if ( builderState.product === "chocoStrawberries" )
        {

            const sizes =
            [
                { value: "dozen", label: "Dozen", price: "$25" }
            ];

            sizes.forEach(function ( s )
            {

                const opt = document.createElement("button");

                opt.type         = "button";

                opt.className    = "sizeOption";

                opt.dataset.size = s.value;

                opt.innerHTML    = "<span class='sizeOptionName'>" + s.label + "</span><span class='sizeOptionPrice'>" + s.price + "</span>";

                opt.addEventListener("click", function ()
                {

                    grid.querySelectorAll(".sizeOption").forEach(function ( b ) { b.classList.remove("isSelected"); });

                    opt.classList.add("isSelected");

                    builderState.size = s.value;

                    updateNextBtn();

                });

                grid.appendChild(opt);

                /* Auto-select since there's only one option */

                opt.click();

            });

        }
        else if ( builderState.product === "customTray" )
        {

            const opt = document.createElement("button");

            opt.type      = "button";

            opt.className = "sizeOption isSelected";

            opt.innerHTML = "<span class='sizeOptionName'>Custom</span><span class='sizeOptionPrice'>Quote Required</span>";

            opt.addEventListener("click", function () {} );

            grid.appendChild(opt);

            builderState.size = "custom";

            updateNextBtn();

        }

    }

    /* ── Flavor Chips ── */

    document.querySelectorAll(".flavorChip").forEach(function ( chip )
    {

        chip.addEventListener("click", function ()
        {

            document.querySelectorAll(".flavorChip").forEach(function ( c ) { c.classList.remove("isSelected"); });

            chip.classList.add("isSelected");

            builderState.flavor = chip.getAttribute("data-flavor");

            updateNextBtn();

        });

    });

    /* ── Pickup Date Validation ── */

    const dateInput = document.getElementById("builderPickupDate");

    if ( dateInput )
    {

        /* Set minimum date to tomorrow */

        const tomorrow = new Date();

        tomorrow.setDate( tomorrow.getDate() + 1 );

        dateInput.min = tomorrow.toISOString().split("T")[0];

        dateInput.addEventListener("change", function ()
        {

            const errorEl = document.getElementById("builderDateError");

            const selected = new Date( dateInput.value + "T00:00:00" );

            const day = selected.getDay();

            const validDays = [1, 2, 5];

            if ( !validDays.includes(day) )
            {

                builderState.date = null;

                if ( errorEl )
                {
                    errorEl.textContent = "Please select a Monday, Tuesday, or Friday.";
                }

            }
            else
            {

                builderState.date = dateInput.value;

                if ( errorEl )
                {
                    errorEl.textContent = "";
                }

            }

            updateNextBtn();

        });

    }

    /* ── Customer Info Fields ── */

    ["bFirstName", "bLastName", "bPhone", "bEmail"].forEach(function ( id )
    {

        const el = document.getElementById(id);

        if ( el )
        {

            el.addEventListener("input", updateNextBtn);

        }

    });

    /* ── Next Button ── */

    if ( nextBtn )
    {

        nextBtn.addEventListener("click", function ()
        {

            if ( !validateStep( builderState.step ) ) { return; }

            if ( builderState.step === 5 )
            {

                builderState.firstName = getVal("bFirstName");

                builderState.lastName  = getVal("bLastName");

                builderState.phone     = getVal("bPhone");

                builderState.email     = getVal("bEmail");

                builderState.notes     = getVal("bNotes");

                populateSummary();

            }

            builderState.step++;

            showPanel( builderState.step );

        });

    }

    /* ── Back Button ── */

    if ( backBtn )
    {

        backBtn.addEventListener("click", function ()
        {

            if ( builderState.step > 1 )
            {

                builderState.step--;

                showPanel( builderState.step );

                updateNextBtn();

            }

        });

    }

    /* ── Populate Summary ── */

    function getProductLabel ( product )
    {

        const labels =
        {
            candyGrapes:       "Candied Fruit",
            chocoStrawberries: "Chocolate Covered Strawberries",
            customTray:        "Custom Candy Tray"
        };

        return labels[ product ] || product;

    }

    function getSizeLabel ( product, size )
    {

        if ( product === "candyGrapes" )
        {

            const labels = { small: "Small", large: "Large", threeFlavor: "Large — 3 Flavors" };

            return labels[ size ] || size;

        }

        if ( product === "chocoStrawberries" ) { return "Dozen"; }

        return "Custom";

    }

    function getFlavorLabel ( flavor )
    {

        const labels =
        {
            blueRaspberry: "Blue Raspberry",
            watermelon:    "Watermelon",
            greenApple:    "Green Apple",
            cottonCandy:   "Cotton Candy",
            strawberry:    "Strawberry",
            pineapple:     "Pineapple",
            mixedFlavor:   "Mixed Flavor",
            milk:          "Milk Chocolate",
            white:         "White Chocolate",
            dark:          "Dark Chocolate"
        };

        return labels[ flavor ] || flavor || "N/A";

    }

    function populateSummary ()
    {

        const setVal = function ( id, value )
        {
            const el = document.getElementById(id);

            if ( el ) { el.textContent = value; }
        };

        setVal( "sumProduct", getProductLabel( builderState.product ) );

        setVal( "sumSize",    getSizeLabel( builderState.product, builderState.size ) );

        setVal( "sumFlavor",  getFlavorLabel( builderState.flavor ) );

        setVal( "sumDate",    builderState.date || "Not selected" );

        setVal( "sumPrice",   getPriceDisplay( builderState.product, builderState.size ) );

    }

    /* ── Submit Order Request ── */

    if ( builderSubmitBtn )
    {

        builderSubmitBtn.addEventListener("click", async function ()
        {

            if ( builderFeedback )
            {
                clearFeedback( builderFeedback );
            }

            builderSubmitBtn.disabled    = true;

            builderSubmitBtn.textContent = "Sending…";

            const payload =
            {

                action:     "orderRequest",

                source:     "740Eatz Website V2",

                product:    getProductLabel( builderState.product ),

                size:       getSizeLabel( builderState.product, builderState.size ),

                flavor:     getFlavorLabel( builderState.flavor ),

                pickupDate: builderState.date,

                firstName:  builderState.firstName,

                lastName:   builderState.lastName,

                phone:      builderState.phone,

                email:      builderState.email,

                notes:      builderState.notes,

                price:      getPriceDisplay( builderState.product, builderState.size ),

                submittedAt: new Date().toISOString()

                /*
                    [V2 PAYMENT HOOK]
                    Add: paymentStatus: "pending"

                    [V2 DASHBOARD HOOK]
                    POST this payload to the order management system.

                    [V2 EMAIL HOOK]
                    Trigger confirmation email to customer and owner.
                */

            };

            try
            {

                const response = await fetch( ORDER_ENDPOINT,
                {

                    method:  "POST",

                    headers: { "Content-Type": "application/json" },

                    body:    JSON.stringify( payload )

                });

                if ( response.ok )
                {

                    showFeedback(
                        builderFeedback,
                        "success",
                        "Your order request has been sent! 740Eatz will contact you to confirm your order, flavor, and pickup details."
                    );

                    builderSubmitBtn.textContent = "Request Sent!";

                }
                else
                {

                    throw new Error("Server error");

                }

            }
            catch ( err )
            {

                showFeedback(
                    builderFeedback,
                    "error",
                    "Something went wrong. Please try again or contact 740Eatz at (220) 240-8435."
                );

                builderSubmitBtn.disabled    = false;

                builderSubmitBtn.textContent = "Send Order Request";

            }

        });

    }

    /* Initialize */

    showPanel(1);

    updateNextBtn();

}
