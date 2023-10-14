import "./App.css";
import { IStore } from "./Store";
import Simulator from "./Simulator";
import { observer } from "mobx-react";
import ExperimentList from "./ExperimentList";

type AppProps = {
  store: IStore;
};

function App(props: AppProps) {
  const experiment = props.store.currentExperiment;
  return (
    <>
      <ExperimentList store={props.store} />
      <Simulator key={experiment?.id} experiment={experiment!} />
    </>
  );
}

export default observer(App);
