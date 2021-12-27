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
        if(treeroot==null)
        {
            treeroot=newnode;
            return;
        }
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
        if(prevnode==null)
        {
            prevnode=newnode;
            return;
        }
        
        if(prevnode.key < newnode.key)
            prevnode.right=newnode;
        else
            prevnode.left=newnode;
        
    }
    
    public void Display(Node node,String side)
    {
        if(node==null)
            return;
        else
            {
                System.out.println("Node Key=" + node.key + " on the " + side);
            }
       // if(node.left !=null)
            Display(node.left,"left");
        //if(node.right !=null)
            Display(node.right,"right");
    }
}
public class SearchTree {
    public static void main(String args[]) {
        BST bst=new BST();
        bst.Insert(50);
        bst.Insert(30);
        bst.Insert(20);
        bst.Insert(40);
        bst.Insert(70);
        bst.Insert(60);
        bst.Insert(80);
        bst.Display(bst.treeroot,"");
    }
    }
    
