import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Node
    {
        int key;
        Node left, right;
 
        public Node(int item)
        {
            key = item;
            left = right = null;
        }
    }
    
class BST
{
    Node treeroot;
    
    public void Insert(int key)
    {
        Node newnode=new Node(key);
        Node currnode=treeroot;
        Node prevnode=null;
        while(currnode != null)
        {
            if(currnode.key < newnode.key)
            {   
                prevnode=currnode;
                currnode=currnode.right;
                
            }
            else
            {
                 prevnode=currnode;
                currnode=currnode.left;
            }
            
        }
        if(prevnode.key < newnode.key)
            prevnode.right=newnode;
        else
            prevnode.left=newnode;
        
    }
}
public class SearchTree {
    public static void main(String args[]) {
        
        
    }
    }
    
