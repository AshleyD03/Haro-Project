let basket = (function() {
    function Basket () {
        let cart_empties = Array.from(document.getElementsByClassName('cart-empty'));
        let cart_buttons = Array.from(document.getElementsByClassName('cart-buttons'));
        let item_targets = Array.from(document.getElementsByClassName('item-target'));
        let cart_totals = Array.from(document.getElementsByClassName('cart-total-target'));
        let template_cart_item = document.getElementById('template-cart-item');
        let template_item_line = document.getElementById('template-item-line');
        let basket_label = document.getElementById('basket-label');
    
        this.basket;
        this.currencySymbol = '£';
    
        // basket.appendItem('cloth', 'wewdawdw', 'this is description', 1499, 1, ['https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ebayimg.com%2Fimages%2Fi%2F252443206275-0-1%2Fs-l1000.jpg&f=1&nofb=1']) 
        // basket.appendItem('cloth2', 'Epic White Shirt', 'this is description', 999, 2, ['https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flerageshirts.com%2Fwp-content%2Fuploads%2F2013%2F10%2Fchallenge-accepted-shirt-meme-rage-face-funny-tee.jpg&f=1&nofb=1'], ['Medium'])
        // Add item to basket, used to check right data input
        this.appendItem = (name, id, description, price, quantity, imageList, affix=[]) => {
            let copyid = this.basket.findIndex(item => item.id === id)
    
            // If the basket already has one in the basket
            if (copyid !== -1) {
                this.basket[copyid].quantity += quantity;
                return this.updateBasket()
            }
    
            // Else add item to basket
            let item = {
                name: name,
                id: id,
                description: description,
                price: price,
                quantity: quantity,
                imageurl: imageList,
                affix: affix
            }
    
            this.basket.push(item)
            return this.updateBasket()
        }
    
        // Lower quantity of item.id by quantity ammmount. If less then 1, remove it.
        this.removeItem = (id, quantity) => {
            let copyid = this.basket.findIndex(item => item.id === id);

            if (copyid === -1) return null
    
            // Change quantity or clear if none left
            this.basket[copyid].quantity -= quantity;
            if (this.basket[copyid].quantity < 1) {
                this.basket.splice(copyid, 1);
            }
            return this.updateBasket()
        }
    
        // Remove all of an item
        this.removeAllOfItem = (id) => {
            let copyid = this.basket.findIndex(item => item.id === id);
            this.basket.splice(copyid, 1);
            return this.updateBasket()
        }

        // Clear the hole basket
        this.clearBasket = () => {
            this.basket = [];
            this.updateBasket();
        }
    
        //  Load Basket Visuals for Page
        this.loadBasket = () => {
            this.expireOldItems()
    
            this.basket = this.getItem('basket');
            item_targets.forEach(target => target.innerHTML = '');
    
            // If basket empty, make empty UI appear
            if (!this.basket || this.basket.length < 1) {
                this.basket = [];
                cart_buttons.forEach(but => but.style.display = 'none');
                item_targets.forEach(target => target.style.display = 'none');
                cart_empties.forEach(cart => cart.style.display = 'flex');
                return
            }
            
            // Make not-empty UI appear
            cart_buttons.forEach(but => but.style.display = 'block');
            cart_empties.forEach(cart => cart.style.display = 'none');
            item_targets.forEach(target => target.style.display = 'block')
    
            let overallTotal = 0;
            let basketLength = 0;

            // Loop through basket items
            this.basket.forEach(item => {
                // Create Template Clone
                let template = template_cart_item.content.cloneNode(true).children[0];
                
                // Get Element Parts
                let img = template.children[0].children[0];
                let name = template.children[0].children[1].children[0];
                let affix = template.children[0].children[1];
                let price = template.children[1].children[0].children[1];
                let quantity = template.children[1].children[1].children[1];
                let total = template.children[1].children[2].children[1];
    
                // Add Values
                img.src = item.imageurl[0];
                name.innerHTML = item.name;
                price.innerHTML = `${this.currencySymbol}${this.penceToPound(item.price)}`;
                quantity.innerHTML = item.quantity // Implement quantity
                total.innerHTML = `${this.currencySymbol}${this.penceToPound(item.price * item.quantity)}`
                item.affix.forEach(text => affix.appendChild(createAffix(text)));

                // Append Element
                item_targets.forEach(target => target.appendChild(template.cloneNode(true)));
    
                // Add line element for spacing
                let line = template_item_line.content.cloneNode(true).children[0];
                item_targets.forEach(target => target.appendChild(line.cloneNode(true)));

                // Increase Iteration Counter
                overallTotal += item.price * item.quantity;
                basketLength += 1 * item.quantity;
            })
    
            // Change cart and basket total
            let totalString = `${this.currencySymbol}${this.penceToPound(overallTotal)}`;
            cart_totals.forEach(total => total.innerHTML = totalString);
            basket_label.children[0].innerHTML = basketLength;

            // Remove last line
            if (this.basket.length > 0) item_targets.forEach(target => target.removeChild(target.lastChild));
        }

    
        // Make code easier to read
        this.updateBasket = () => {
           this.setItem('basket', this.basket);
           this.loadBasket();
        }
    
        // Stringify data into json string, to then push to storage
        this.setItem = (key, data) => {
            try {
                let time = new Date();
                let json = JSON.stringify({time: time, data: data})
    
                window.localStorage.setItem(key, json)
                return true
            } catch (e) {
                return false
            }
        }

        this.penceToPound = (string) => {
            string = new String(string);
            return string.insert(-2, '.')
        }
    
        // Get json string from storage, and parse back to json
        this.getItem = (key) => {
            try {
                let jsonString = window.localStorage.getItem(key);
                let parseData = JSON.parse(jsonString);
    
                return parseData.data
            } catch (e) {
                return null;
            }
        }
    
        // Check time property of all item's in storage. If they have been in storage for more then a week, remove them.
        this.expireOldItems = () => {
            let n = window.localStorage.length;
            let now = new Date();
            let maxAge = 1000 * 60 * 60 * 24 * 7 // 7 Days
    
            for (let i; i < n; i++) {
                let itemKey = window.localStorage.key(i);
                let itemData = window.localStorage.getItem(itemKey)
    
                try {
                    let parseData = JSON.parse(itemData);
                    let itemTime = new Date(parseData.time);
                    let timeDif = now.valueOf() - itemTime.valueOf();
    
                    if (timeDif > maxAge) window.localStorage.removeItem(itemKey);
    
                } catch (e) {}
            }
        }
    
        // Draw canvas data of image and encode to Data URL to return
        this.encodeImageToUrl = (image) => {
            let canvas = document.createElement('canvas');
            canvas.height = image.height;
            canvas.width = image.width;
    
            let ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
    
            let dataUrl = canvas.toDataURL('image/png')
            return dataUrl
        }
    
        this.loadBasket();

        // Create an affix to be added on items
        function createAffix (string='') {
            let node = document.createElement('div');
            node.classList.add('cart-afix');
            node.innerHTML = string;
            
            return node
        }
    }
    // Realy good guide, credit due
    // http://www.ashleysheridan.co.uk/blog/Using+Local+Storage+to+Cache+Images
    return new Basket();
})()

