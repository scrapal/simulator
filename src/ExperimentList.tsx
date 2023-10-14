import { observer } from "mobx-react";
import { Experiment, IExperiment, IStore } from "./Store";
import classnames from "classnames";
import { useState } from "react";
import { set } from "mobx";

type ExperimentListProps = {
  store: IStore;
};

export default observer(function ExperimentList(props: ExperimentListProps) {
  const [currentEdit, setCurrentEdit] = useState<IExperiment>();
  const { store } = props;
  const handleAdd = () => {
    store.addExperiment(new Experiment("New Experiment"));
  };
  const handleSelect = (experiment: IExperiment) => {
    if (experiment === store.currentExperiment) {
      return;
    }
    setCurrentEdit(undefined);
    store.setCurrentExperiment(experiment);
  };
  const handleDelete = (e: React.MouseEvent, experiment: IExperiment) => {
    store.removeExperiment(experiment);
    e.stopPropagation();
  };
  const handleEdit = (experiment: IExperiment) => {
    setCurrentEdit(experiment);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    currentEdit!.name = name;
  };
  const handleBlur = () => {
    setCurrentEdit(undefined);
  };

  return (
    <div className="flex flex-col w-48">
      <div className="flex flex-row">
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {store.experiments.map((experiment) => (
          <li
            key={experiment.id}
            className={classnames(
              "flex flex-row  p-2 border-b-2 border-gray-300 border-1 h-12",
              {
                selected: store.currentExperiment === experiment,
              }
            )}
            onClick={() => handleSelect(experiment)}
            onDoubleClick={() => handleEdit(experiment)}
          >
            <span className="flex flex-1">
              {currentEdit === experiment ? (
                <input
                  value={experiment.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ) : (
                experiment.name
              )}
            </span>
            {props.store.experiments.length > 1 && !currentEdit && (
              <button
                onClick={(e) => handleDelete(e, experiment)}
                className="ml-2 "
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});
