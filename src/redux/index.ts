import { configureSagaMiddleware, createStore } from "@/utils/store";

const sagaMiddleware = configureSagaMiddleware();

export const store = createStore(sagaMiddleware);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
