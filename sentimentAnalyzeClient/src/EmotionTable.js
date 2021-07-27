import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
                this.props.emotions.map(emotion => (
                  <tr>
                    <td>{emotion.type}</td>
                    <td>{emotion.value}</td>
                  </tr>
                ))
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;