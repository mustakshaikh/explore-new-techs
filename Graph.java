import java.util.*;

public class Graph {
    static ArrayList<ArrayList<Integer> > listAdj;
    static int V;
    Graph(int Size){
        V=Size;
        listAdj=new ArrayList<ArrayList<Integer> >(Size);
        for (int i = 0; i < V; i++)
            listAdj.add(new ArrayList<Integer>());
    }
    static void addEdge(int Start,int End,boolean bidir){
        listAdj.get(Start).add(End);
        if(bidir)
            listAdj.get(End).add(Start);
    }
    
    static void printGraph()
    {
        for (int i = 0; i < listAdj.size(); i++) {
            System.out.println("\nAdjacency list of vertex" + i);
            System.out.print("head");
            for (int j = 0; j < listAdj.get(i).size(); j++) {
                System.out.print(" -> "+listAdj.get(i).get(j));
            }
            System.out.println();
        }
    }
    
    public static void main(String args[]) {
     Graph graph=new Graph(10);
     graph.addEdge(0,1,true);
     graph.addEdge(0,6,true);
     graph.addEdge(0,8,true);
     graph.addEdge(1,0,true);
     graph.addEdge(1,4,true);
     graph.addEdge(1,6,true);
     graph.addEdge(1,9,true);
     graph.printGraph();
    }
}
