'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { PlanetModalState, PlanetDetailData, CameraState } from '@/types/universe';

// 액션 타입 정의
type PlanetModalAction =
  | { type: 'OPEN_MODAL'; payload: { planetId: string; viewport: CameraState } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ANIMATING'; payload: boolean }
  | { type: 'SET_PLANET_DATA'; payload: PlanetDetailData };

// 초기 상태
const initialState: PlanetModalState = {
  isOpen: false,
  selectedPlanetId: null,
  isAnimating: false,
  lastViewport: null,
};

// 리듀서
function planetModalReducer(state: PlanetModalState, action: PlanetModalAction): PlanetModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        selectedPlanetId: action.payload.planetId,
        lastViewport: action.payload.viewport,
        isAnimating: true,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isOpen: false,
        selectedPlanetId: null,
        isAnimating: false,
      };
    case 'SET_ANIMATING':
      return {
        ...state,
        isAnimating: action.payload,
      };
    default:
      return state;
  }
}

// Context 생성
interface PlanetModalContextType {
  state: PlanetModalState;
  openModal: (planetId: string, viewport: CameraState) => void;
  closeModal: () => void;
  setAnimating: (isAnimating: boolean) => void;
}

const PlanetModalContext = createContext<PlanetModalContextType | undefined>(undefined);

// Provider 컴포넌트
interface PlanetModalProviderProps {
  children: ReactNode;
}

export function PlanetModalProvider({ children }: PlanetModalProviderProps) {
  const [state, dispatch] = useReducer(planetModalReducer, initialState);

  const openModal = useCallback((planetId: string, viewport: CameraState) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: { planetId, viewport },
    });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const setAnimating = useCallback((isAnimating: boolean) => {
    dispatch({ type: 'SET_ANIMATING', payload: isAnimating });
  }, []);

  const value: PlanetModalContextType = {
    state,
    openModal,
    closeModal,
    setAnimating,
  };

  return (
    <PlanetModalContext.Provider value={value}>
      {children}
    </PlanetModalContext.Provider>
  );
}

// Hook
export function usePlanetModal() {
  const context = useContext(PlanetModalContext);
  if (context === undefined) {
    throw new Error('usePlanetModal must be used within a PlanetModalProvider');
  }
  return context;
}
