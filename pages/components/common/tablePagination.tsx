import React from "react";
import { Table, Menu, Icon, Form, TableCell, Button } from "semantic-ui-react";
import { player } from "@/model/player";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
interface TablePaginationProps {
  data: object[] | null;
  page: Number;
  totalpage: Number;
  setPage: Function;
  setSearch: Function;
  selected: Number;
  setSelected: Function;
  setSubmit: Function;
}


const TablePagination: React.FC<TablePaginationProps> = ({
  data,
  page,
  totalpage,
  setPage,
  setSearch,
  selected,
  setSelected,
  setSubmit,
  
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onsubmit = (data:any) => {
        console.log("submitted",data)
        setSearch(data.search)

    }

    const disable = (checkboxValue: Number) => {
      return  checkboxValue!==selected && (selected === -1)
    }

  if(data?.length === 0){
    return(
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="cursor-pointer" onClick={()=>window.location.reload()}>No Result is Found</h1>
      </div>
    )

  }

  return (
    <div>
    <Form className="flex flex-row-reverse" onSubmit={handleSubmit(onsubmit)}>
    <Form.Field className="w-1/5 h-full">
      <input 
      {...register('search', { required: true })}
      placeholder="Enter player's name" />
    </Form.Field >
  </Form>
    <Table celled>
      <Table.Header>
        <Table.Row>
            <Table.HeaderCell key={0}>Select</Table.HeaderCell>
          {Object.keys(data[0]).map((field, index) => (
            <Table.HeaderCell key={index}>{field}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.length !== 0 && data.map((player: any, rowIndex) => (
          <Table.Row key={rowIndex}>
            <Table.Cell>
            <input
            type="checkbox"
            disabled={disable(player["player ID"])}
            value={player["player ID"]}
            checked={selected === player["player ID"]}
            onChange={(event) => {
                if (event.target.checked) {
                setSelected(player["player ID"]);
                } else {
                setSelected(0); 
                }
            }}
            />
            </Table.Cell>
            {Object.values(player).map((value, colIndex) => {
              // If the value is an array or object, you might want to convert it to a string or handle it differently
              let displayValue:any = value;
              if (
                Array.isArray(value) ||
                (value !== null && typeof value === "object")
              ) {
                displayValue = JSON.stringify(value);
              }
              return <Table.Cell key={colIndex}>{displayValue}</Table.Cell>;
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    <div className="flex justify-between">
    <Button
    color="blue"
    disabled={selected==-1}
    onClick={()=>{
        setSubmit(selected);
    }}
    >
    SUBMIT
    </Button>
    {page === 1 && (
            <Menu pagination>
              <Menu.Item
              as="a" icon />
              <Menu.Item
              active={true}
              as="a">{page.valueOf()}</Menu.Item>
              <Menu.Item 
              onClick={() => setPage(page.valueOf() + 1)}
              as="a">{page.valueOf() + 1}</Menu.Item>
              <Menu.Item 
              onClick={() => setPage(page.valueOf() + 2)}
              as="a">{page.valueOf() + 2}</Menu.Item>
              <Menu.Item as="a" icon>
                <Icon
                  name="chevron right"
                  onClick={() => setPage(page.valueOf() + 1)}
                />
              </Menu.Item>
            </Menu>
          )}
          {page !== 1 && page !== totalpage && (
            <Menu floated="right" pagination>
              <Menu.Item as="a" icon>
                <Icon
                  name="chevron left"
                  onClick={() => setPage(page.valueOf() - 1)}
                />
              </Menu.Item>
              <Menu.Item
              onClick={() => setPage(page.valueOf() - 1)}
              as="a">{page.valueOf() - 1}</Menu.Item>
              <Menu.Item 
              active={true}
              as="a">{page.valueOf()}</Menu.Item>
              <Menu.Item 
              onClick={() => setPage(page.valueOf() + 1)}
              as="a">{page.valueOf() + 1}</Menu.Item>
              <Menu.Item as="a" icon>
                <Icon
                  name="chevron right"
                  onClick={() => setPage(page.valueOf() + 1)}
                />
              </Menu.Item>
            </Menu>
          )}
          {page !== 1 && page === totalpage && (
            <Menu pagination>
              <Menu.Item as="a" icon>
                <Icon
                  name="chevron left"
                  onClick={() => setPage(page.valueOf() - 1)}
                />
              </Menu.Item>
              <Menu.Item 
              onClick={() => setPage(page.valueOf() - 2)}
              as="a">{page.valueOf() - 2}</Menu.Item>
              <Menu.Item 
              onClick={() => setPage(page.valueOf() - 1)}
              as="a">{page.valueOf() - 1}</Menu.Item>
              <Menu.Item 
              active={true}
              as="a">{page.valueOf()}</Menu.Item>
            </Menu>
          )}
    </div>
    </div>
  );
};

export default TablePagination;
