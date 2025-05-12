import React, { useState, useCallback } from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string'; // Ограничиваем только строковым типом для данного задания
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors?: Color[]; // Убрал обязательность, чтобы не усложнять задачу
}

interface Color {
    id: number;
    name: string;
    hex: string;
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  localModel: Model; // Используем локальную копию модели для редактирования
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      localModel: this.props.model,
    };
  }

  // Функция для получения Model с измененными значениями
  public getModel(): Model {
    return this.state.localModel;
  }

  // Обработчик изменения значения параметра
  private handleParamValueChange = (paramId: number, value: string) => {
    this.setState((prevState) => {
      const updatedParamValues = prevState.localModel.paramValues.map((pv) =>
        pv.paramId === paramId ? { ...pv, value } : pv
      );

      // Если параметра нет в списке, добавляем его
      if (!updatedParamValues.some((pv) => pv.paramId === paramId)) {
        updatedParamValues.push({ paramId, value });
      }

      return {
        localModel: {
          ...prevState.localModel,
          paramValues: updatedParamValues,
        },
      };
    });
  };

  render() {
    const { params } = this.props;
    const { localModel } = this.state;

    return (
      <div>
        {params.map((param) => {
          const paramValue = localModel.paramValues.find(
            (pv) => pv.paramId === param.id
          )?.value || ''; // Получаем значение параметра из localModel

          return (
            <div key={param.id}>
              <label htmlFor={`param-${param.id}`}>{param.name}:</label>
              <input
                type="text"
                id={`param-${param.id}`}
                value={paramValue}
                onChange={(e) => this.handleParamValueChange(param.id, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}


// Пример использования:
interface AppProps {}
interface AppState {
  params: Param[];
  model: Model;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      params: [
        { id: 1, name: "Назначение", type: "string" },
        { id: 2, name: "Длина", type: "string" },
      ],
      model: {
        paramValues: [
          { paramId: 1, value: "повседневное" },
          { paramId: 2, value: "макси" },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <h1>Param Editor</h1>
        <ParamEditor params={this.state.params} model={this.state.model} />
      </div>
    );
  }
}

export default App;