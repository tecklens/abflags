import AbWelcome from './ab-welcome';
import {AbProvider} from "@abflags/react-sdk";

export function App() {
  return (
    <AbProvider config={{
      url: 'http://localhost:3232',
      clientKey: '8842220188c505598172c251c216346f',
      appName: 'test2',
      userId: '1'
    }}>
      <AbWelcome title="Abflags"/>
    </AbProvider>
  );
}

export default App;
