import { AuthContextProvider } from './authContext';
import { BoardContextProvider } from './boardContext';
import { ListContextProvider } from './listContext';
import { CardContextProvider } from './cardContext';

const AppProvider = ({ children }) => {
  return (
    <AuthContextProvider>
      <BoardContextProvider>
        <ListContextProvider>
          <CardContextProvider>
            {children}
          </CardContextProvider>
        </ListContextProvider>
      </BoardContextProvider>
    </AuthContextProvider>
  )
}

export {AppProvider};