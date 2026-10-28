import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { type SagaMiddleware } from "redux-saga";

const rootReducer = combineReducers({});

export const configureSagaMiddleware = (): SagaMiddleware => createSagaMiddleware();

export const createStore = (sagaMiddleware: SagaMiddleware) =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
    });
