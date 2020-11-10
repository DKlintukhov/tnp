import React from 'react';

interface Props {
	children: React.ReactNode
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      error: null,
    };
  }

  componentDidCatch(error: Error) {
    this.setState({
      error
    })
  }


  render() {
    if (this.state.error) { 
      return <h1>Error</h1>
    }

    return this.props.children;
  }
}