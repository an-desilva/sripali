'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, IOrderItem, IProduct } from '@sripalie/types';

interface CartItem {
  product: IProduct;
  lensType: 'single-vision' | 'bifocal' | 'progressive' | 'blue-cut';
  lensPrice: number;
  prescriptionData?: any;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  cart: CartItem[];
  login: (token: string, user: IUser) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('sripalie_token');
    const savedUser = localStorage.getItem('sripalie_user');
    const savedCart = localStorage.getItem('sripalie_cart');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user state');
      }
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart state');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sripalie_token', newToken);
    localStorage.setItem('sripalie_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sripalie_token');
    localStorage.removeItem('sripalie_user');
  };

  const addToCart = (item: CartItem) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem('sripalie_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('sripalie_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('sripalie_cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        cart,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
