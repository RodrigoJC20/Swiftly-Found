const form = document.getElementById('search-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    CleanResults();

    const searchTerm = document.getElementById('search-input').value;
    
    console.log(`You searched for: ${searchTerm}`);
    
    
    const url = `https://store.taylorswift.com/search?q=${encodeURIComponent(searchTerm)}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const parser = new DOMParser();
            const responseHtml = parser.parseFromString(xhr.responseText, 'text/html');
            
            const productElements = responseHtml.querySelectorAll('.ProductItem');

            const baseURL = 'https://store.taylorswift.com';

            const products = Array.from(productElements).map(productElement => {
                const name = productElement.querySelector('.ProductItem__Title a').textContent;
                const price = productElement.querySelector('.ProductItem__Price').textContent.trim();
                const relativeLink = productElement.querySelector('.ProductItem__Title a').getAttribute('href');
                const link = new URL(relativeLink, baseURL).toString();

                return { name, price, link };
            });

            const productItemTemplate = document.querySelector('#item-template');

            const productListContainer = document.querySelector('#product-list');

            for (const product of products) {
                const productItem = productItemTemplate.content.cloneNode(true);
                productItem.querySelector('.card-title').textContent = product.name;
                productItem.querySelector('.card-text').textContent = product.price;
                //productItem.querySelector('a').setAttribute('href', product.link);
                productItem.querySelector('a').addEventListener('click', async (event) => {
                    event.preventDefault();
                    
                    await RequestProductDetails(product);

                });

                productListContainer.appendChild(productItem);
            }
        } else {
            console.error('There was a problem with the network request:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('There was a problem with the network request:', xhr.statusText);
    };
    xhr.send();
});

async function RequestProductDetails(product) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', product.link);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const parser = new DOMParser();
            const responseHtml = parser.parseFromString(xhr.responseText, 'text/html');

            const productDescription = responseHtml.querySelector('.ProductMeta__Description').innerHTML

            console.log(productDescription);

            document.querySelector('#product-details').innerHTML = `
                <div class="content">
                    <h2>${product.name}</h2>
                    <p>Price: ${product.price}</p>
                    <p class="product-description">${productDescription}</p>
                    <a href="${product.link}" target="_blank" class="view-product">View product in page</a>
                </div>
                    `;
        } else {
            console.error('There was a problem with the network request:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('There was a problem with the network request:', xhr.statusText);
    };
    xhr.send();
}

function CleanResults() {
    document.querySelector('#product-list').innerHTML = '<template id=\"item-template\"> <div class=\"col col-md-4 col-12\"> <div class=\"card h-100\"> <div class=\"card-body\"> <h5 class=\"card-title\"></h5> <p class=\"card-text\"></p> <a href=\"\" class=\"btn purple-btn\" target=\"_blank\">View product</a> </div> </div> </div> </template>';
    document.querySelector('#product-details').innerHTML = '';
}