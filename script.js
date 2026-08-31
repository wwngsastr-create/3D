/* =====================================================
   PRINTLAB
   Main JavaScript
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let quantity = 1;


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

/**
 * แปลงขนาดไฟล์ให้อ่านง่าย
 */
function formatFileSize(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}


/**
 * สร้างเลข Order
 */
function createOrderID() {

    const year = new Date().getFullYear();

    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `PL-${year}-${random}`;
}


/**
 * ดึงวัสดุที่เลือก
 */
function getMaterial() {

    return document.querySelector(
        'input[name="material"]:checked'
    );
}


/**
 * ดึงสีที่เลือก
 */
function getColor() {

    return document.querySelector(
        'input[name="color"]:checked'
    );
}


/* =====================================================
   ORDER SYSTEM
===================================================== */

const fileInput =
    document.getElementById("fileInput");

const fileInfo =
    document.getElementById("fileInfo");

const weightInput =
    document.getElementById("weight");

const qualityInput =
    document.getElementById("quality");

const quantityDisplay =
    document.getElementById("quantity");

const minusButton =
    document.getElementById("minusButton");

const plusButton =
    document.getElementById("plusButton");

const totalPrice =
    document.getElementById("totalPrice");

const priceMaterial =
    document.getElementById("priceMaterial");

const priceWeight =
    document.getElementById("priceWeight");

const priceQuantity =
    document.getElementById("priceQuantity");

const priceQuality =
    document.getElementById("priceQuality");


/* =====================================================
   FILE UPLOAD
===================================================== */

if (fileInput) {

    fileInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }


        /* รองรับนามสกุล */

        const allowedExtensions = [
            "stl",
            "obj",
            "3mf"
        ];


        const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();


        /* ตรวจสอบนามสกุล */

        if (!allowedExtensions.includes(extension)) {

            alert(
                "รองรับเฉพาะไฟล์ STL, OBJ และ 3MF"
            );

            this.value = "";

            if (fileInfo) {
                fileInfo.classList.add("hidden");
            }

            return;
        }


        /* จำกัดขนาด 100 MB */

        const maxSize =
            100 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "ไฟล์มีขนาดใหญ่เกิน 100 MB"
            );

            this.value = "";

            if (fileInfo) {
                fileInfo.classList.add("hidden");
            }

            return;
        }


        /* แสดงข้อมูลไฟล์ */

        if (fileInfo) {

            const size =
                formatFileSize(file.size);


            fileInfo.classList.remove("hidden");


            fileInfo.innerHTML = `
                <strong>✓ ${file.name}</strong>
                <br>
                <span>ขนาดไฟล์: ${size}</span>
            `;
        }

    });

}


/* =====================================================
   CALCULATE PRICE
===================================================== */

function calculatePrice() {

    /*
        ถ้าไม่ได้อยู่หน้า order
        ให้หยุดทำงาน
    */

    if (!weightInput || !totalPrice) {
        return;
    }


    const material = getMaterial();

    if (!material) {
        return;
    }


    const weight =
        Number(weightInput.value) || 0;


    const pricePerGram =
        Number(material.dataset.price) || 0;


    let qualityMultiplier = 1;


    if (qualityInput) {

        qualityMultiplier =
            Number(qualityInput.value) || 1;

    }


    /*
        ราคาวัสดุ
    */

    const materialPrice =
        weight * pricePerGram;


    /*
        รวมคุณภาพ
    */

    const pricePerPiece =
        materialPrice *
        qualityMultiplier;


    /*
        รวมจำนวน
    */

    const total =
        pricePerPiece *
        quantity;


    /*
        ราคาขั้นต่ำ
    */

    const minimumPrice = 50;


    const finalPrice =
        Math.max(total, minimumPrice);


    /* แสดงราคา */

    totalPrice.textContent =
        "฿ " + finalPrice.toFixed(2);


    /* แสดงรายละเอียด */

    if (priceMaterial) {

        priceMaterial.textContent =
            material.value;

    }


    if (priceWeight) {

        priceWeight.textContent =
            weight + " g";

    }


    if (priceQuantity) {

        priceQuantity.textContent =
            quantity;

    }


    if (priceQuality) {

        let qualityName =
            "Standard";


        if (qualityMultiplier === 1.3) {

            qualityName = "Fine";

        }


        if (qualityMultiplier === 1.6) {

            qualityName = "Ultra Fine";

        }


        priceQuality.textContent =
            qualityName;
    }

}


/* =====================================================
   QUANTITY PLUS
===================================================== */

if (plusButton) {

    plusButton.addEventListener("click", function () {

        quantity++;


        if (quantityDisplay) {

            quantityDisplay.textContent =
                quantity;

        }


        calculatePrice();

    });

}


/* =====================================================
   QUANTITY MINUS
===================================================== */

if (minusButton) {

    minusButton.addEventListener("click", function () {

        if (quantity > 1) {

            quantity--;

        }


        if (quantityDisplay) {

            quantityDisplay.textContent =
                quantity;

        }


        calculatePrice();

    });

}


/* =====================================================
   WEIGHT INPUT
===================================================== */

if (weightInput) {

    weightInput.addEventListener(
        "input",
        calculatePrice
    );

}


/* =====================================================
   QUALITY INPUT
===================================================== */

if (qualityInput) {

    qualityInput.addEventListener(
        "change",
        calculatePrice
    );

}


/* =====================================================
   MATERIAL INPUT
===================================================== */

const materialInputs =
    document.querySelectorAll(
        'input[name="material"]'
    );


materialInputs.forEach(function (input) {

    input.addEventListener(
        "change",
        calculatePrice
    );

});


/* =====================================================
   INITIAL PRICE
===================================================== */

calculatePrice();


/* =====================================================
   SUBMIT ORDER
===================================================== */

const submitOrder =
    document.getElementById(
        "submitOrder"
    );


if (submitOrder) {

    submitOrder.addEventListener(
        "click",
        function () {


            /* =========================
               GET CUSTOMER DATA
            ========================= */

            const nameInput =
                document.getElementById(
                    "customerName"
                );


            const phoneInput =
                document.getElementById(
                    "customerPhone"
                );


            const emailInput =
                document.getElementById(
                    "customerEmail"
                );


            const noteInput =
                document.getElementById(
                    "customerNote"
                );


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const note =
                noteInput
                    ? noteInput.value.trim()
                    : "";


            /* =========================
               GET ORDER DATA
            ========================= */

            const material =
                getMaterial();


            const color =
                getColor();


            const weight =
                weightInput
                    ? Number(weightInput.value) || 0
                    : 0;


            /* =========================
               VALIDATION
            ========================= */

            if (!name) {

                alert(
                    "กรุณากรอกชื่อ"
                );

                if (nameInput) {
                    nameInput.focus();
                }

                return;
            }


            if (!phone) {

                alert(
                    "กรุณากรอกเบอร์โทร"
                );

                if (phoneInput) {
                    phoneInput.focus();
                }

                return;
            }


            if (!fileInput ||
                !fileInput.files[0]) {

                alert(
                    "กรุณาอัปโหลดไฟล์ 3D"
                );

                return;
            }


            if (!material) {

                alert(
                    "กรุณาเลือกวัสดุ"
                );

                return;
            }


            if (!color) {

                alert(
                    "กรุณาเลือกสี"
                );

                return;
            }


            /* =========================
               CREATE ORDER
            ========================= */

            const orderID =
                createOrderID();


            const price =
                totalPrice
                    ? totalPrice.textContent
                    : "฿ 0.00";


            const order = {

                id: orderID,

                customer: name,

                phone: phone,

                email: email,

                note: note,

                file:
                    fileInput.files[0].name,

                material:
                    material.value,

                color:
                    color.value,

                weight:
                    weight,

                quantity:
                    quantity,

                price:
                    price,

                status:
                    "กำลังดำเนินการ",

                createdAt:
                    new Date()
                        .toLocaleString("th-TH")

            };


            /* =========================
               SAVE ORDER
            ========================= */

            localStorage.setItem(
                "printlabOrder",
                JSON.stringify(order)
            );


            /* =========================
               SUCCESS
            ========================= */

            alert(
                "ส่งคำสั่งซื้อเรียบร้อยแล้ว!\n\n" +
                "เลขคำสั่งซื้อ: " +
                orderID
            );


            /* =========================
               GO TO TRACKING
            ========================= */

            window.location.href =
                "tracking.html?order=" +
                encodeURIComponent(orderID);

        }
    );

}


/* =====================================================
   TRACKING SYSTEM
===================================================== */

const searchOrder =
    document.getElementById(
        "searchOrder"
    );


if (searchOrder) {

    searchOrder.addEventListener(
        "click",
        searchTracking
    );


    /*
        ตรวจสอบว่ามี Order ID
        ส่งมาจาก URL หรือไม่
    */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const orderFromURL =
        params.get("order");


    if (orderFromURL) {

        const orderSearch =
            document.getElementById(
                "orderSearch"
            );


        if (orderSearch) {

            orderSearch.value =
                orderFromURL;

        }


        searchTracking();

    }

}


/* =====================================================
   TRACKING SEARCH
===================================================== */

function searchTracking() {

    const orderSearch =
        document.getElementById(
            "orderSearch"
        );


    const result =
        document.getElementById(
            "trackingResult"
        );


    const empty =
        document.getElementById(
            "trackingEmpty"
        );


    /*
        ถ้าไม่ได้อยู่หน้า Tracking
    */

    if (!orderSearch ||
        !result ||
        !empty) {

        return;
    }


    const search =
        orderSearch.value
            .trim()
            .toUpperCase();


    /*
        ดึง Order จาก LocalStorage
    */

    const saved =
        localStorage.getItem(
            "printlabOrder"
        );


    /* =========================
       ไม่มี Order
    ========================= */

    if (!saved) {

        result.classList.add(
            "hidden"
        );

        empty.classList.remove(
            "hidden"
        );

        empty.innerHTML = `
            <div>◌</div>

            <h2>
                ยังไม่มีข้อมูล
            </h2>

            <p>
                กรุณาสร้างคำสั่งซื้อก่อน
            </p>
        `;

        return;
    }


    let order;


    try {

        order =
            JSON.parse(saved);

    } catch (error) {

        console.error(
            "ไม่สามารถอ่านข้อมูล Order ได้",
            error
        );

        result.classList.add(
            "hidden"
        );

        empty.classList.remove(
            "hidden"
        );

        empty.innerHTML = `
            <div>!</div>

            <h2>
                เกิดข้อผิดพลาด
            </h2>

            <p>
                ไม่สามารถอ่านข้อมูลคำสั่งซื้อได้
            </p>
        `;

        return;
    }


    /* =========================
       ตรวจสอบ Order ID
    ========================= */

    if (
        search !==
        order.id.toUpperCase()
    ) {

        result.classList.add(
            "hidden"
        );

        empty.classList.remove(
            "hidden"
        );

        empty.innerHTML = `
            <div>?</div>

            <h2>
                ไม่พบคำสั่งซื้อ
            </h2>

            <p>
                กรุณาตรวจสอบหมายเลข Order อีกครั้ง
            </p>
        `;

        return;
    }


    /* =========================
       SHOW ORDER
    ========================= */

    const trackingOrder =
        document.getElementById(
            "trackingOrder"
        );


    const trackingCustomer =
        document.getElementById(
            "trackingCustomer"
        );


    const trackingMaterial =
        document.getElementById(
            "trackingMaterial"
        );


    const trackingQuantity =
        document.getElementById(
            "trackingQuantity"
        );


    const trackingPrice =
        document.getElementById(
            "trackingPrice"
        );


    const trackingStatus =
        document.getElementById(
            "trackingStatus"
        );


    if (trackingOrder) {

        trackingOrder.textContent =
            order.id;

    }


    if (trackingCustomer) {

        trackingCustomer.textContent =
            order.customer;

    }


    if (trackingMaterial) {

        trackingMaterial.textContent =
            order.material;

    }


    if (trackingQuantity) {

        trackingQuantity.textContent =
            order.quantity + " ชิ้น";

    }


    if (trackingPrice) {

        trackingPrice.textContent =
            order.price;

    }


    if (trackingStatus) {

        trackingStatus.textContent =
            order.status;

    }


    /* =========================
       SHOW RESULT
    ========================= */

    result.classList.remove(
        "hidden"
    );


    empty.classList.add(
        "hidden"
    );

}


/* =====================================================
   ENTER KEY FOR TRACKING
===================================================== */

const orderSearchInput =
    document.getElementById(
        "orderSearch"
    );


if (orderSearchInput) {

    orderSearchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchTracking();

            }

        }
    );

}


/* =====================================================
   END OF SCRIPT
===================================================== */