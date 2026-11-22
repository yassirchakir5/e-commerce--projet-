import { createContext, useState } from 'react';

export const CartContext = createContext();

const resolveProductImage = (product) => {
    if (product.image) {
        return product.image.startsWith('http')
            ? product.image
            : `http://127.0.0.1:8000/storage/${product.image}`;
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
        const mainObj = product.images.find((img) => img.is_main) || product.images[0];
        if (mainObj?.path) {
            return `http://127.0.0.1:8000/storage/${mainObj.path}`;
        }
    }
    return 'https://via.placeholder.com/150?text=Produit';
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, qty = 1) => {
        const addedQty = Math.max(1, Number(qty) || 1);
        const resolvedImg = resolveProductImage(product);

        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.id === product.id);
            const maxStock = product.stock !== undefined ? Number(product.stock) : Infinity;

            if (existingIndex > -1) {
                const updated = [...prevItems];
                const newQty = Math.min(maxStock, updated[existingIndex].quantity + addedQty);
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    image: resolvedImg,
                    quantity: newQty,
                };
                return updated;
            }

            return [
                ...prevItems,
                {
                    ...product,
                    name: product.name || product.nom || 'Produit',
                    image: resolvedImg,
                    quantity: Math.min(maxStock, addedQty),
                },
            ];
        });
    };

    const updateQuantity = (indexToUpdate, newQty) => {
        setCartItems((prevItems) =>
            prevItems.map((item, idx) => {
                if (idx !== indexToUpdate) return item;
                const maxStock = item.stock !== undefined ? Number(item.stock) : Infinity;
                const validQty = Math.min(maxStock, Math.max(1, Number(newQty) || 1));
                return { ...item, quantity: validQty };
            })
        );
    };

    const removeFromCart = (indexToRemove) => {
        setCartItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    };

    const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + (Number(item.prix) || 0) * (Number(item.quantity) || 1),
        0
    );

    return (
        <CartContext.Provider
            value={{ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart }}
        >
            {children}
        </CartContext.Provider>
    );
};