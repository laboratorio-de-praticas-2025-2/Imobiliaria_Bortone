"use client";
import Card from "@/components/cms/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { usersMock } from "@/mock/users";
import { useEffect, useState } from "react";
import { MdPersonAdd } from "react-icons/md";

export default function CmsUserPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [filterData, setFilterData] = useState({ order: null });

  useEffect(() => {
    setUsers(usersMock);
  }, []);

  // fatia os usuários conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const onSearch = (value) => console.log("Search:", value);
  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({ ...prev, order: value }));
    console.log("Selected order:", value);
  };
  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
    console.log("Update filter data:", newData);
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Usuários"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Novo Usuário"
              buttonIcon={<MdPersonAdd />}
              onSearch={onSearch}
              href={"/admin/cms-usuarios/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
            />
            <CMS.TableBody>
              {paginatedUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-center">
                  {paginatedUsers.map((user) => (
                    <Card key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <p>No users found.</p>
              )}
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={users}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
