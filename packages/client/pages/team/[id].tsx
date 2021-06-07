
export default function TeamById(props: { id: string }) {

    return <p>todo.</p>

}


export async function getServerSideProps({ params }) {
    const id = params.id as string;
  
    return { props: { id } };
  }