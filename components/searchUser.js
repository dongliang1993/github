import {Spin, Select} from 'antd'
import {useState, useCallback, useRef} from 'react'
import {debounce} from '../lib/util'
import {request} from '../lib/api'

const {Option} = Select;

export default ({onChange, value}) => {
  const lastFetchId = useRef(0);
  const [fetch, setFetch] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchUser = useCallback(debounce(value => {
    console.log('fetching user');
    lastFetchId.current += 1;
    const fetchId = lastFetchId.current;
    setFetch(true);
    setOptions([]);
    request({
      url: `/search/users?q=${value}`
    }).then(res => {
      console.log(res.data);
      if (lastFetchId.current !== fetchId) {
        return;
      }
      const data = res.data.items.map(user => ({
        text: user.login,
        value: user.login
      }));
      setFetch(false);
      setOptions(data)
    });
  }, 500), []);

  const handleChange = value => {
    setOptions([]);
    setFetch(false);
    onChange(value)
  };


  return (
      <Select
          style={{
            width: 200
          }}
          showSearch={true}
          notFoundContent={fetch ? <Spin size={'small'}/> : <span>nothing</span>}
          filterOption={false}
          placeholder="创建者"
          onChange={handleChange}
          value={value}
          onSearch={fetchUser}
          allowClear={true}
      >
        {options.map(option => {
          return (
              <Option
                  value={option.value}
                  key={option.value}
              >
                {option.text}
              </Option>
          )
        })}
      </Select>
  )
}
