import Text from '../Text'
const titles = ['Server ID', 'Name', 'URL', 'Last Error', 'Last Date', 'Status'];

const TableHead = () => {
  return (
    <thead>
      <tr>
        {titles.map(name => (
        <td key={name}>
            <Text type='tiny' color={4}>{name}</Text>
        </td>
        ))}
      </tr>
    </thead>
  )
}

export default TableHead